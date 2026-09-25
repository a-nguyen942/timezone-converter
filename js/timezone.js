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
