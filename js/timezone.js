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

// pass in for both sides to calculate for DST
export function calculateTimeDiff(leftTimezone, rightTimezone, hypotheticalDateTime)
{
    // define variable to hold the numerical difference we get
    // remember timeLeft holds the truth
    // return integer time difference
    const leftTimezoneOffset = new Intl.DateTimeFormat('en-US', {
        timeZone: leftTimezone,
        timeZoneName: 'longOffset'
    })
        .formatToParts(hypotheticalDateTime)
        .find((part) => part.type === 'timeZoneName')
        ?.value;

    const rightTimezoneOffset = new Intl.DateTimeFormat('en-US', {
        timeZone: rightTimezone,
        timeZoneName: 'longOffset'
    })
        .formatToParts(hypotheticalDateTime)
        .find((part) => part.type === 'timeZoneName')
        ?.value;

    const leftMatch = leftTimezoneOffset?.match(/GMT([+-])(\d{2}):(\d{2})/);
    const rightMatch = rightTimezoneOffset?.match(/GMT([+-])(\d{2}):(\d{2})/);

    const leftOffset = leftMatch
        ? (Number(leftMatch[2]) * 60 + Number(leftMatch[3])) * (leftMatch[1] === '+' ? 1 : -1)
        : 0;
    const rightOffset = rightMatch
        ? (Number(rightMatch[2]) * 60 + Number(rightMatch[3])) * (rightMatch[1] === '+' ? 1 : -1)
        : 0;

    return rightOffset - leftOffset;
}

function calculateHypotheticalRT(timeRight, timeDiff)
{
    // take time difference to calculate new times and date accordingly
    // return object giving time and date accordingly
}

export function convertTimeTo24Hr(time, period)
{
    // take time and convert to 24hr version, return a string
    const [hourText, minuteText] = time.split(':');
    let hour = Number(hourText);
    const minute = Number(minuteText);

    if (
        !['AM', 'PM'].includes(period) ||
        !Number.isInteger(hour) ||
        !Number.isInteger(minute) ||
        hour < 1 || hour > 12 ||
        minute < 0 || minute > 59
    ) {
        throw new Error('Time must use a valid 12-hour time and AM/PM period.');
    }

    if (period === 'AM' && hour === 12) {
        hour = 0;
    }

    if (period === 'PM' && hour !== 12) {
        hour += 12;
    }

    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function convertTimeTo12Hr(time)
{
    // take 24hr time and convert to 12hr time with am/pm
    const [hourText, minuteText] = time.split(':');
    const hour = Number(hourText);
    const minute = Number(minuteText);

    if (
        !Number.isInteger(hour) ||
        !Number.isInteger(minute) ||
        hour < 0 || hour > 23 ||
        minute < 0 || minute > 59
    ) {
        throw new Error('Time must use a valid 24-hour time.');
    }

    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;

    return {
        time: `${displayHour}:${String(minute).padStart(2, '0')}`,
        period
    };
}
