// called from main.js
let countriesByNormalizedName = null;
let countryIndexLoadPromise = null;

export async function loadCountryIndex() {
    if (countriesByNormalizedName) {
        return countriesByNormalizedName;
    }

    if (!countryIndexLoadPromise) {
        const countryIndexUrl = new URL('../data/countries.json', import.meta.url);

        countryIndexLoadPromise = fetch(countryIndexUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Unable to load country index: ${response.status}`);
                }

                return response.json();
            })
            .then((countryIndex) => {
                countriesByNormalizedName = countryIndex;
                return countriesByNormalizedName;
            })
            .catch((error) => {
                countryIndexLoadPromise = null;
                throw error;
            });
    }

    return countryIndexLoadPromise;
}

function normalizeInput(input) {
    return input
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

export function searchCountries(countryInput)
{
    const normalizedInput = normalizeInput(countryInput);
    const countries = [];

    // search database for countries according to userInput
    // while countries.length !== 5;
    // take text and scan through countries
    // if we find any countries matching the text (startswith) then append it to countries

    for (const [normalizedName, country] of Object.entries(countriesByNormalizedName)) {
        if (!normalizedName.startsWith(normalizedInput)) {
            continue;
        }

        countries.push({
            normalizedName,
            ...country
        });

        if (countries.length === 5) {
            break;
        }
    }

    return countries;
}

function searchCities(country, cityInput)
{
    // search database for cities according to country chosen and userInput
}

// check if the search input is empty, if so have dropdown display recently searched countries/cities
function checkRecentSearches(searchInput)
{
    // if empty, display recent searches
}

function clearSearchBarText()
{
    // clears text from searchContent

}
