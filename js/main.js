/*
    TODO:
        Work on search logic for cities
        Work on recentCountries/recentCities logic
        Finish being able to select cities in the searchBar
        Work on timezone calculation/differences
        Add weatherAPI using longitude and latitude
*/

const appState = {
    left: {
        country: null,
        city: null,
        timezone: null,
        recentCountries: [],
        recentCities: []
    },
    right: {
        country: null,
        city: null,
        timezone: null,
        recentCountries: [],
        recentCities: []
    },
    rightCitySelected: false // keeps right side hyphenated
};

const elements = {
    left: {
        // Inputs & Controls
        card: document.querySelector('.time-card-left'),
        countryInput: document.querySelector('.time-card-left .search-bar-country'),
        countryClearBtn: document.querySelector('.time-card-left .country-search-wrapper .clear-search-btn'),
        countryDropdown: document.querySelector('.time-card-left .country-recommendations'),

        cityInput: document.querySelector('.time-card-left .search-bar-city'),
        cityClearBtn: document.querySelector('.time-card-left .city-search-wrapper .clear-search-btn'),
        cityDropdown: document.querySelector('.time-card-left .city-recommendations'),

        // Display Outputs (for time/date/country/city)
        countryInitials: document.querySelector('.time-card-left .country-initials'),
        countryDisplay: document.querySelector('.time-card-left .country'),
        cityDisplay: document.querySelector('.time-card-left .city'),
        timezoneAbbr: document.querySelector('.time-card-left .timezone-abbreviation'),
        timeDisplay: document.querySelector('.time-card-left .time'),
        dateDisplay: document.querySelector('.time-card-left .date')
    },
    right: {
        // Inputs & Controls
        card: document.querySelector('.time-card-right'),
        countryInput: document.querySelector('.time-card-right .search-bar-country'),
        countryClearBtn: document.querySelector('.time-card-right .country-search-wrapper .clear-search-btn'),
        countryDropdown: document.querySelector('.time-card-right .country-recommendations'),

        cityInput: document.querySelector('.time-card-right .search-bar-city'),
        cityClearBtn: document.querySelector('.time-card-right .city-search-wrapper .clear-search-btn'),
        cityDropdown: document.querySelector('.time-card-right .city-recommendations'),

        // Display Outputs
        countryInitials: document.querySelector('.time-card-right .country-initials'),
        countryDisplay: document.querySelector('.time-card-right .country'),
        cityDisplay: document.querySelector('.time-card-right .city'),
        timezoneAbbr: document.querySelector('.time-card-right .timezone-abbreviation'),
        timeDisplay: document.querySelector('.time-card-right .time'),
        dateDisplay: document.querySelector('.time-card-right .date')
    }
};

// FUNCTIONS
import { showDropdownMenu, hideDropdownMenu, showDeleteButton, hideDeleteButton, selectDropdownChoice, loadCountries, loadCities, displayNoResultsFound } from './ui.js';
import { loadCountryIndex, searchCountries, searchCities, clearSearchBarText } from './search.js';

async function initializeApp() {
    await loadCountryIndex();
    attachDropdownListeners();
}

function saveSelectedCountry(dropdownChoice, side, type) {
    if (type !== 'country') {
        return;
    }

    const countryName = dropdownChoice.textContent.trim();
    const selectedCountry = searchCountries(countryName)
        .find((country) => country.name === countryName);

    if (selectedCountry) {
        appState[side].country = selectedCountry;
    }
}

function attachDropdownListeners() {
    ['left', 'right'].forEach(side => {
        const sideElements = elements[side];

        ['country', 'city'].forEach(type => {
            const input = sideElements[`${type}Input`];
            const clearBtn = sideElements[`${type}ClearBtn`];
            const dropdown = sideElements[`${type}Dropdown`];
            const wrapper = input.closest('.search-wrapper');

            if (!input || !clearBtn || !dropdown || !wrapper) return;

            // INPUT
            input.addEventListener('focus', async () => {
                const searchText = input.value.trim();

                if (searchText) {
                    showDeleteButton(clearBtn);
                }

                if (type === 'country') {
                    if (searchText) {
                        const countriesToDisplay = searchCountries(searchText);

                        if (countriesToDisplay.length === 0) {
                            displayNoResultsFound(dropdown);
                        } else {
                            loadCountries(countriesToDisplay, dropdown);
                        }

                        return;
                    }

                    const recentCountries = appState[side].recentCountries;

                    if (recentCountries.length > 0) {
                        loadCountries(recentCountries, dropdown);
                    }

                    return;
                }

                if (searchText) {
                    if (!appState[side].country) {
                        return;
                    }

                    const citiesToDisplay = await searchCities(appState[side].country, searchText);

                    if (citiesToDisplay.length === 0) {
                        displayNoResultsFound(dropdown);
                    } else {
                        loadCities(citiesToDisplay, dropdown);
                    }

                    return;
                }

                const recentCities = appState[side].recentCities;

                if (recentCities.length > 0) {
                    loadCities(recentCities, dropdown);
                    return;
                }

                if (!appState[side].country) {
                    return;
                }

                const citiesToDisplay = await searchCities(appState[side].country, '');

                if (citiesToDisplay.length === 0) {
                    displayNoResultsFound(dropdown);
                } else {
                    loadCities(citiesToDisplay, dropdown);
                }
            });

            wrapper.addEventListener('focusout', (event) => {
                if (!wrapper.contains(event.relatedTarget)) {
                    hideDropdownMenu(dropdown);
                    hideDeleteButton(clearBtn);
                }
            });

            input.addEventListener('input', async () => {
                const searchText = input.value.trim();

                if (type === 'country') {
                    const countriesToDisplay = searchText
                        ? searchCountries(searchText)
                        : appState[side].recentCountries;

                    if (countriesToDisplay.length === 0) {
                        displayNoResultsFound(dropdown);
                    } else {
                        loadCountries(countriesToDisplay, dropdown);
                    }

                    return;
                }

                if (!appState[side].country) {
                    return;
                }

                const citiesToDisplay = await searchCities(appState[side].country, searchText);

                if (citiesToDisplay.length === 0) {
                    displayNoResultsFound(dropdown);
                } else {
                    loadCities(citiesToDisplay, dropdown);
                }
            });

            input.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' || dropdown.hidden) return;

                const firstDropdownChoice = dropdown.querySelector('.country-recommendation, .city-recommendation');

                if (!firstDropdownChoice) return;

                event.preventDefault();
                saveSelectedCountry(firstDropdownChoice, side, type);
                selectDropdownChoice(firstDropdownChoice, input, dropdown);
            });

            // DROPDOWN BOXES
            dropdown.addEventListener('pointerdown', (event) => {
                const dropdownChoice = event.target.closest('.country-recommendation, .city-recommendation');

                if (!dropdownChoice || !dropdown.contains(dropdownChoice)) return;

                const recentSearches = type === 'country'
                    ? appState[side].recentCountries
                    : appState[side].recentCities;
                const selectedSearch = dropdownChoice.textContent.trim();
                const existingSearchIndex = recentSearches.indexOf(selectedSearch);

                if (existingSearchIndex !== -1) {
                    recentSearches.splice(existingSearchIndex, 1);
                }

                if (recentSearches.length >= 5) {
                    recentSearches.shift();
                }

                recentSearches.push(selectedSearch);
                saveSelectedCountry(dropdownChoice, side, type);
                selectDropdownChoice(dropdownChoice, input, dropdown);
                getCurrentTime(timezone, side);
            });

            input.addEventListener('keydown', (event) => {
                if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

                const dropdownChoices = [...dropdown.querySelectorAll('.country-recommendation, .city-recommendation')];

                if (dropdownChoices.length === 0) return;

                event.preventDefault();
                showDropdownMenu(dropdown);

                const choiceIndex = event.key === 'ArrowDown' ? 0 : dropdownChoices.length - 1;
                dropdownChoices[choiceIndex].focus();
            });

            dropdown.addEventListener('keydown', (event) => {
                if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

                const dropdownChoice = event.target.closest('.country-recommendation, .city-recommendation');

                if (!dropdownChoice || !dropdown.contains(dropdownChoice)) return;

                const dropdownChoices = [...dropdown.querySelectorAll('.country-recommendation, .city-recommendation')];
                const currentIndex = dropdownChoices.indexOf(dropdownChoice);
                const direction = event.key === 'ArrowDown' ? 1 : -1;
                const nextIndex = (currentIndex + direction + dropdownChoices.length) % dropdownChoices.length;

                event.preventDefault();
                dropdownChoices[nextIndex].focus();
            });

            dropdown.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter') return;

                const dropdownChoice = event.target.closest('.country-recommendation, .city-recommendation');

                if (!dropdownChoice || !dropdown.contains(dropdownChoice)) return;

                event.preventDefault();
                saveSelectedCountry(dropdownChoice, side, type);
                selectDropdownChoice(dropdownChoice, input, dropdown);
            });

            wrapper.addEventListener('keydown', (event) => {
                if (event.key !== 'Escape' || dropdown.hidden) return;

                event.preventDefault();
                document.activeElement.blur();
                hideDropdownMenu(dropdown);
            });

            // DELETE BUTTON
            clearBtn.addEventListener('pointerdown', (event) => {
                event.preventDefault();
                clearSearchBarText(input);
                hideDropdownMenu(dropdown);
                hideDeleteButton(clearBtn);
            });
        });
    });
}

initializeApp();
