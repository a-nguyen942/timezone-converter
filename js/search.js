// called from main.js
let countriesByNormalizedName = null;
let countryIndexLoadPromise = null;
let loadedCountryFile = null;
let loadedCities = null;

export async function loadCountryIndex() {
    if (countriesByNormalizedName) {
        return countriesByNormalizedName;
    }

    if (!countryIndexLoadPromise) {
        const countryIndexUrl = new URL('../data/countries-to-file.json', import.meta.url);

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

export async function searchCities(country, cityInput)
{
    // search database for cities according to country chosen and userInput
    if (loadedCountryFile !== country.file || !loadedCities) {
        const cityFileUrl = new URL(`../data/${country.file}`, import.meta.url);
        const response = await fetch(cityFileUrl);

        if (!response.ok) {
            throw new Error(`Unable to load cities for ${country.name}: ${response.status}`);
        }

        const countryData = await response.json();

        loadedCountryFile = country.file;
        loadedCities = countryData.cities;
    }

    const normalizedInput = normalizeInput(cityInput);
    const matchingCities = [];

    for (const city of loadedCities) {
        if (!city.normalizedName.startsWith(normalizedInput)) {
            continue;
        }

        matchingCities.push(city);

        if (matchingCities.length === 5) {
            break;
        }
    }

    return matchingCities;
}

export function clearSearchBarText(searchBar)
{
    // clears text from searchContent
    searchBar.value = '';
}
