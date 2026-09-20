// UI

export const NO_RESULTS_MESSAGE = "No matches found";

/*
    function displaySearchData(data)
    {
        goes through the data (data would be an list)
        create  5 boxes to dom, filling their text content with the data
    }
*/

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

function loadCountries()
{

}

function loadCities()
{

}

function displayNoResultsFound()
{

}