/*
    TODO:
        Work on data search design and appending the first 5 choices to our dropdownMenuContainers
        Finish being able to select cities in the searchBar
        Work on timezone calculation/differences
        Add weatherAPI using longitude and latitude
*/

const appState = {
    left: {
        country: null,
        city: null,
        timezone: null
    },
    right: {
        country: null,
        city: null,
        timezone: null
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
import { showDropdownMenu, hideDropdownMenu, showDeleteButton, hideDeleteButton } from './ui.js';
import { loadSearchData } from './search.js';

function attachDropdownListeners() {
    ['left', 'right'].forEach(side => {
        const sideElements = elements[side];

        ['country', 'city'].forEach(type => {
            const input = sideElements[`${type}Input`];
            const clearBtn = sideElements[`${type}ClearBtn`];
            const dropdown = sideElements[`${type}Dropdown`];
            const wrapper = input.closest('.search-wrapper');

            if (!input || !clearBtn || !dropdown || !wrapper) return;

            // attach dropdown listener on search bar, when the search bar is clicked a corresponding dropdown menu is set to visible and the "x" representing the delete button appears (add a focus mode)
            input.addEventListener('focus', () => {
                if (input.value.trim()) {
                    showDeleteButton(clearBtn);
                }
                if (dropdown.children.length > 0) {
                    showDropdownMenu(dropdown);
                }
            });

            // listener for when lfocus leaves the wrapper
            wrapper.addEventListener('focusout', (event) => {
                if (!wrapper.contains(event.relatedTarget)) {
                    hideDropdownMenu(dropdown);
                    hideDeleteButton(clearBtn);
                }
            });

            // listener for when user starts typing, when its typing we can call search
            input.addEventListener('input', () => {
                loadSearchData(input.value);
            });

            // DROPDOWN BOXES
            dropdown.addEventListener('pointerdown', (event) => {
                const dropdownChoice = event.target.closest('.country-recommendation, .city-recommendation');

                if (!dropdownChoice || !dropdown.contains(dropdownChoice)) return;

                selectDropdownChoice(dropdownChoice, input, dropdown);
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
                selectDropdownChoice(dropdownChoice, input, dropdown);
            });


            // DELETE BUTTON
            // add eventListener for pointerdown on delete button, if delete button is clicked call resetSearchBar
        });
    });
}

/*
    function initSearch(){
        call loadSearchData from search.js
        call displaySearchData from ui.js
    }

    function resetSearchBar()
    {
        clearSearchBarText();
        hideDropdownMenu();
        hideDeleteButton();
    }
*/


// EVENT LISTENERS






// ON BOOTUP
// *default display*
// hyphens on the right side till user chooses a city
attachDropdownListeners();
