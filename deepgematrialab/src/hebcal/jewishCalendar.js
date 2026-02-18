// jewishCalendar.js
const HEBREW_EPOCH = -1373429;

export function isLeapYear(year) {
  return ((7 * year + 1) % 19) < 7;
}

export function hebrewCalendarElapsedDays(year) {
  const months = Math.floor((235 * year - 234) / 19);
  const parts = 204 + 793 * (months % 1080);
  const hours = 5 + 12 * months + 793 * Math.floor(months / 1080) + Math.floor(parts / 1080);
  let day = 1 + 29 * months + Math.floor(hours / 24);
  const frac = (hours % 24) * 1080 + (parts % 1080);

  if (
    frac >= 19440 ||
    (day % 7 === 2 && frac >= 9924 && !isLeapYear(year)) ||
    (day % 7 === 1 && frac >= 16789 && isLeapYear(year - 1))
  ) {
    day++;
  }
  if ([0, 3, 5].includes(day % 7)) day++;
  return day;
}

export function daysInHebrewYear(year) {
  return hebrewCalendarElapsedDays(year + 1) - hebrewCalendarElapsedDays(year);
}

export function hebrewToAbsolute(year, month, day) {
  return HEBREW_EPOCH + hebrewCalendarElapsedDays(year) + day;
}

export function gregorianToAbsolute(date) {
  return Math.floor(date.getTime() / 86400000);
}

export function absoluteToHebrewYear(abs) {
  let year = Math.floor((abs - HEBREW_EPOCH) / 366) + 1;
  while (abs >= hebrewToAbsolute(year + 1, 1, 1)) {
    year++;
  }
  return year;
}
