// handle timezone calculations and conversions
export function getCurrentTimezoneData(timezone, city) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short'
    });

    const timezoneParts = formatter.formatToParts(new Date());
    const getPartValue = (type) => timezoneParts.find((part) => part.type === type)?.value;

    return {
        time: `${getPartValue('hour')}:${getPartValue('minute')}`,
        period: getPartValue('dayPeriod'),
        date: `${getPartValue('weekday')}, ${getPartValue('month')} ${getPartValue('day')}`,
        timezoneAbbreviation: getPartValue('timeZoneName')
    };
}

function calculateTimezoneDifference(timeLeft, timeRight)
{
    // define variable to hold the numerical difference we get
    // remember timeLeft holds the truth
    // return integer time difference
}

function calculateHypotheticalRT(timeRight, timeDiff)
{
    // take time difference to calculate new times and date accordingly
    // return object giving time and date accordingly
}

function convertTimeTo24Hr(time)
{
    // take time and convert to 24hr version, return a string
}

function convertTimeTo12Hr(time)
{
    // take 24hr time and convert to 12hr time with am/pm
}