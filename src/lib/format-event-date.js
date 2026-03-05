/**
 * Formats a date string into Indonesian format
 * @param {string} isoString - The ISO date string to format
 * @param {('full'|'short'|'time')} [format='full'] - The format type to use
 * @param {boolean} [isJakartaTime=false] - Whether the input is already in Jakarta time
 * @returns {string} The formatted date string in Indonesian
 *
 * @example
 * // returns "Senin, 1 Januari 2024"
 * formatEventDate("2024-01-01T00:00:00.000Z", "full")
 *
 * // returns "1 Januari 2024"
 * formatEventDate("2024-01-01T00:00:00.000Z", "short")
 *
 * // returns "00:00"
 * formatEventDate("2024-01-01T00:00:00.000Z", "time")
 */
export const formatEventDate = (isoString, format = "full", isJakartaTime = false) => {
    let date = new Date(isoString);

    if (isJakartaTime && isoString && !isoString.endsWith("Z")) {
        date = new Date(isoString + "Z");
    }

    const formats = {
        full: {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "Europe/Moscow",
        },
        long: {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "Europe/Moscow",
        },
        short: {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "Europe/Moscow",
        },
        time: {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Europe/Moscow",
        },
    };

    if (format === "time") {
        return date.toLocaleTimeString("ru-RU", formats[format]);
    }

    return date.toLocaleDateString("ru-RU", formats[format] || formats.full);
};
