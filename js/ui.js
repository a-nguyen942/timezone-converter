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

function setLeadingText(element, value) {
    if (element.firstChild?.nodeType === Node.TEXT_NODE) {
        element.firstChild.textContent = value ?? '';
    } else {
        element.prepend(document.createTextNode(value ?? ''));
    }
}

export function displayTimeCardData(side, timeCardData, elements) {
    const {
        countryCode,
        countryName,
        cityName,
        timezone,
        timezoneAbbr,
        time,
        timePeriod,
        date,
        weatherStatus,
        weatherIconPath,
        apparentTemp,
        actualTemp,
        windSpeed
    } = timeCardData;

    const sideElements = elements[side];

    sideElements.countryInitials.textContent = countryCode ?? '';
    sideElements.countryDisplay.textContent = countryName ?? '';
    sideElements.cityDisplay.textContent = cityName ?? '';
    sideElements.timezoneAbbr.textContent = timezoneAbbr ?? '';
    sideElements.dateDisplay.textContent = date ?? '';

    setLeadingText(sideElements.card.querySelector('.timezone'), timezone);
    setLeadingText(sideElements.timeDisplay, time);

    sideElements.timeDisplay.querySelector('.period').textContent = timePeriod ?? '';
    sideElements.weatherStatus.textContent = weatherStatus ?? '';
    sideElements.actualTemp.textContent = actualTemp == null ? '' : `Temperature: ${actualTemp}°F`;
    sideElements.apparentTemp.textContent = apparentTemp == null ? '' : `Feels like: ${apparentTemp}°F`;
    sideElements.windSpeed.textContent = windSpeed == null ? '' : `Wind speed: ${windSpeed} mph`;

    sideElements.weatherIcon.replaceChildren();

    if (weatherIconPath) {
        const weatherIcon = document.createElement('img');

        weatherIcon.className = 'weather-icon-image';
        weatherIcon.src = weatherIconPath;
        weatherIcon.alt = '';

        sideElements.weatherIcon.append(weatherIcon);
    }

}
