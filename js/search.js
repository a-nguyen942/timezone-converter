// add in dataset of just countries to search through to avoid searching through the entire dataset of countries and cities

// data structure to hold recently searched countries

// called from main.js
function loadSearchData(){
    // call checkRecentSearches
    // call normalizeInput
    // call filterCountries
}

// check if the search input is empty, if so have dropdown display recently searched countries/cities
function checkRecentSearches(searchInput)
{
    // if empty, display recent searches
    // else call normalizeInput
}

// user starts typing and normalizeInput runs
function normalizeInput(searchInput)
{
    // normalize input to all lowercase and turn any characters with accents to base characters
    // pass normalized input to filterCountries to begin filtering through dataset of countries/cities
}

// normalized input is passed to filterCountries to begin filtering through dataset of countries/cities
function filterCountries(normalizedInput)
{
    // wittle down countries that don't contain letters the user gave
    // display this to dropdown list of countries/cities that match the input
    // let dropdown list only be max 5 countries when we hit 5 or there are no more countries/cities return early
    // when returning list, check if its empty
    // if !empty return list
    // else if empty return "No matches"
}


function clearSearchBarText()
{
    // clears text from searchContent

}