const appState = {
    isHypotheticalTime: false,
    left: {
        country: null,
        city: null,
        timezone: null,
        currentWeather: null,
        recentCountries: [],
        recentCities: [],
        hypotheticalDate: null,
        hypotheticalTime: null,
        hypotheticalPeriod: null
    },
    right: {
        country: null,
        city: null,
        timezone: null,
        currentWeather: null,
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
        dateDisplay: document.querySelector('.time-card-left .date'),
        weatherStatus: document.querySelector('.time-card-left .weather-status'),
        weatherIcon: document.querySelector('.time-card-left .weather-icon'),
        actualTemp: document.querySelector('.time-card-left .actual-temperature'),
        apparentTemp: document.querySelector('.time-card-left .apparent-temperature'),
        windSpeed: document.querySelector('.time-card-left .wind-speed')
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
        dateDisplay: document.querySelector('.time-card-right .date'),
        weatherStatus: document.querySelector('.time-card-right .weather-status'),
        weatherIcon: document.querySelector('.time-card-right .weather-icon'),
        actualTemp: document.querySelector('.time-card-right .actual-temperature'),
        apparentTemp: document.querySelector('.time-card-right .apparent-temperature'),
        windSpeed: document.querySelector('.time-card-right .wind-speed')
    }
};

const swapButton = document.querySelector('.swap-button');

// FUNCTIONS
import { showDropdownMenu, hideDropdownMenu, showDeleteButton, hideDeleteButton, selectDropdownChoice, loadCountries, loadCities, displayNoResultsFound, displayTimeCardData } from './ui.js';
import { loadCountryIndex, searchCountries, searchCities, clearSearchBarText } from './search.js';
import { getCurrentTimezoneData, convertTimeTo24Hr, calculateHypotheticalRT, convertTimeTo12Hr } from './timezone.js';
import { getLocalWeatherData, getWeatherIcon, getWeatherStatus } from './weather.js';

async function initializeApp() {
    await loadCountryIndex();
    await loadDefaultLocation('left', 'United States', 'San Francisco');
    await loadDefaultLocation('right', 'United States', 'New York City');
    attachEventListeners();
    startDataRefreshes();
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

async function saveSelectedCity(dropdownChoice, side, type) {
    if (type !== 'city' || !appState[side].country) {
        return;
    }

    const cityName = dropdownChoice.textContent.trim();
    const selectedCity = (await searchCities(appState[side].country, cityName))
        .find((city) => city.name === cityName);

    if (selectedCity) {
        appState[side].city = selectedCity;
        appState[side].timezone = selectedCity.timezone;
        appState[side].currentWeather = null;
    }
}

async function getTimeCardData(side, refreshWeather = false) {
    const country = appState[side].country;
    const city = appState[side].city;
    const timezone = appState[side].timezone;
    const timezoneData = timezone ? getCurrentTimezoneData(timezone) : null;

    if (city && (!appState[side].currentWeather || refreshWeather)) {
        const weatherData = await getLocalWeatherData(city);

        appState[side].currentWeather = weatherData.current;
    }

    const currentWeather = appState[side].currentWeather;
    const weatherCode = currentWeather?.weather_code;
    const weatherIconPath = weatherCode === undefined ? null : getWeatherIcon(weatherCode);
    const weatherStatus = weatherCode === undefined ? null : getWeatherStatus(weatherCode);

    return {
        countryCode: country?.code,
        countryName: country?.name,
        cityName: city?.name,
        timezone,
        timezoneAbbr: timezoneData?.timezoneAbbreviation,
        time: timezoneData?.time,
        timePeriod: timezoneData?.period,
        date: timezoneData?.date,
        weatherStatus,
        weatherIconPath,
        apparentTemp: currentWeather?.apparent_temperature,
        actualTemp: currentWeather?.temperature_2m,
        windSpeed: currentWeather?.wind_speed_10m
    };
}

async function refreshTimeCards(refreshWeather = false) {
    await Promise.all(['left', 'right'].map(async (side) => {
        if (!appState[side].city) {
            return;
        }

        const timeCardData = await getTimeCardData(side, refreshWeather);

        displayTimeCardData(side, timeCardData, elements);
    }));
}

function startDataRefreshes() {
    setInterval(() => {
        refreshTimeCards();
    }, 60 * 1000);

    setInterval(() => {
        refreshTimeCards(true);
    }, 15 * 60 * 1000);
}

async function loadDefaultLocation(side, countryName, cityName) {
    const country = searchCountries(countryName)
        .find((result) => result.name === countryName);

    if (!country) {
        return;
    }

    const city = (await searchCities(country, cityName))
        .find((result) => result.name === cityName);

    if (!city) {
        return;
    }

    appState[side].country = country;
    appState[side].city = city;
    appState[side].timezone = city.timezone;
    appState[side].currentWeather = null;

    elements[side].countryInput.value = country.name;
    elements[side].cityInput.value = city.name;

    const timeCardData = await getTimeCardData(side);
    displayTimeCardData(side, timeCardData, elements);
}

function getHypotheticalRT(dateLeft, timeLeft, timePeriod, timeDiff)
{
    // call convertTimeTo24Hr(time) and store result in a variable for timeLeft
    const timeLeft24Hr = convertTimeTo24Hr(timeLeft, timePeriod);

    // call calculateHypotheticalRT(dateLeft, newtimeLeft, timeDiff) and store object
    const rightTimeData = calculateHypotheticalRT(dateLeft, timeLeft24Hr, timeDiff);

    // call convertTimeTo12Hr on the timeRight in our object
    const rightTime12Hr = convertTimeTo12Hr(rightTimeData.time);

    // return object
    return {
        time: rightTime12Hr.time,
        timePeriod: rightTime12Hr.period,
        date: rightTimeData.date
    };
}

function attachEventListeners() {
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

            input.addEventListener('keydown', async (event) => {
                if (event.key !== 'Enter' || dropdown.hidden) return;

                const firstDropdownChoice = dropdown.querySelector('.country-recommendation, .city-recommendation');

                if (!firstDropdownChoice) return;

                event.preventDefault();
                saveSelectedCountry(firstDropdownChoice, side, type);
                await saveSelectedCity(firstDropdownChoice, side, type);
                selectDropdownChoice(firstDropdownChoice, input, dropdown);

                if (type === 'city') {
                    const timeCardData = await getTimeCardData(side);
                    displayTimeCardData(side, timeCardData, elements);
                }
            });

            // DROPDOWN BOXES
            dropdown.addEventListener('pointerdown', async (event) => {
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
                await saveSelectedCity(dropdownChoice, side, type);

                selectDropdownChoice(dropdownChoice, input, dropdown);

                if (type === 'city') {
                    const timeCardData = await getTimeCardData(side);
                    displayTimeCardData(side, timeCardData, elements);
                }
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

            dropdown.addEventListener('keydown', async (event) => {
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

            dropdown.addEventListener('keydown', async (event) => {
                if (event.key !== 'Enter') return;

                const dropdownChoice = event.target.closest('.country-recommendation, .city-recommendation');

                if (!dropdownChoice || !dropdown.contains(dropdownChoice)) return;

                event.preventDefault();
                saveSelectedCountry(dropdownChoice, side, type);
                await saveSelectedCity(dropdownChoice, side, type);
                selectDropdownChoice(dropdownChoice, input, dropdown);

                if (type === 'city') {
                    const timeCardData = await getTimeCardData(side);
                    displayTimeCardData(side, timeCardData, elements);
                }
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

    if (!swapButton) {
        return;
    }

    swapButton.addEventListener('click', async () => {
        ['country', 'city', 'timezone', 'currentWeather'].forEach((property) => {
            [appState.left[property], appState.right[property]] = [appState.right[property], appState.left[property]];
        });

        ['left', 'right'].forEach((side) => {
            elements[side].countryInput.value = appState[side].country?.name ?? '';
            elements[side].cityInput.value = appState[side].city?.name ?? '';
        });

        await refreshTimeCards();
    });
}

initializeApp();
