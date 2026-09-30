import { getCurrentTimezoneData } from './timezone.js';

// UI

export const NO_RESULTS_MESSAGE = "No matches found";

export function selectDropdownChoice(dropdownChoice, searchBar, dropdown) {
    searchBar.value = dropdownChoice.textContent.trim();
    hideDropdownMenu(dropdown);
}

export function showDropdownMenu(dropdown) {
    dropdown.removeAttribute("hidden");
}

export function hideDropdownMenu(dropdown) {
    dropdown.setAttribute("hidden", "");
}

export function showDeleteButton(button) {
    button.style.display = "flex";
}

export function hideDeleteButton(button) {
    button.style.display = "none";
}

export function clearSearchText(searchBar, dropdown, button)
    {
        searchBar.value = "";
        hideDropdownMenu(dropdown);
        hideDeleteButton(button);
    }

export function loadCountries(countries, dropdown) {
    const countryChoices = dropdown.querySelectorAll('.country-recommendation');

    countryChoices.forEach((countryChoice, index) => {
        const country = countries[index];

        countryChoice.textContent = typeof country === 'string' ? country : country ? country.name : '';
        const hasCountryText = countryChoice.textContent.trim() !== '';

        countryChoice.hidden = !hasCountryText;
        countryChoice.disabled = !hasCountryText;
    });

    showDropdownMenu(dropdown);
}

export function loadCities(cities, dropdown) {
    const cityChoices = dropdown.querySelectorAll('.city-recommendation');

    cityChoices.forEach((cityChoice, index) => {
        const city = cities[index];

        cityChoice.textContent = typeof city === 'string' ? city : city ? city.name : '';
        const hasCityText = cityChoice.textContent.trim() !== '';

        cityChoice.hidden = !hasCityText;
        cityChoice.disabled = !hasCityText;
    });

    showDropdownMenu(dropdown);
}

export function displayNoResultsFound(dropdown) {
    const dropdownChoices = dropdown.querySelectorAll('.country-recommendation, .city-recommendation');

    dropdownChoices.forEach((dropdownChoice, index) => {
        const isMessageChoice = index === 0;

        dropdownChoice.textContent = isMessageChoice ? NO_RESULTS_MESSAGE : '';
        dropdownChoice.hidden = !isMessageChoice;
        dropdownChoice.disabled = isMessageChoice;
    });

    showDropdownMenu(dropdown);
}

function setRightSideToHyphens()
{

}

export function displayTimeCardData(side, appState, elements) {
    const country = appState[side].country;
    const city = appState[side].city;
    const timezone = appState[side].timezone;
    const timezoneData = timezone ? getCurrentTimezoneData(timezone) : null;

    const countryCode = country?.code;
    const countryName = country?.name;
    const cityName = city?.name;
    const timezoneAbbr = timezoneData?.timezoneAbbreviation;


    const time = timezoneData?.time;
    const timePeriod = timezoneData?.period;
    const date = timezoneData?.date;

    let weatherStatus; // later holds data such as sunny, rainy, etc.
    let apparentTemp;
    let actualTemp;
    let windSpeed;

    const sideElements = elements[side];

}

function clearTimeCard(side)
{
    // clear respective timecard dom objects
}
