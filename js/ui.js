// UI

export const NO_RESULTS_MESSAGE = "No matches found";

/*
    function createSearchResultItem()
    {
        creates a dropdown menu box item, later to be filled with textContent calculated from functions in search.js
    }
*/

/*
    function displaySearchData(data)
    {
        goes through the data (data would be an list)
        create  5 boxes to dom, filling their text content with the data
    }
*/

/*
    function selectDropdownChoice()
    {
        takes the dropdownChoice's textContent and sets it to the respective search bar's textContent
    }
*/

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
