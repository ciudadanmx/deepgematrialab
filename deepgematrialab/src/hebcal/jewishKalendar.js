// jewishkalendar.js
const HEBREW_EPOCH = -1373429;

export function isLeapYear(year) {
  return ((7 * year + 1) % 19) < 7;
}

export function hebrewKalendarElapsedDays(year) {
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
  return hebrewKalendarElapsedDays(year + 1) - hebrewKalendarElapsedDays(year);
}

export function hebrewToAbsolute(year, month, day) {
  return HEBREW_EPOCH + hebrewKalendarElapsedDays(year) + day;
}

export function gregorianToAbsolute(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  const isLeap =
    y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);

  const monthLengths = [
    0,
    31,
    isLeap ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  let days =
    365 * (y - 1) +
    Math.floor((y - 1) / 4) -
    Math.floor((y - 1) / 100) +
    Math.floor((y - 1) / 400);

  for (let i = 1; i < m; i++) {
    days += monthLengths[i];
  }

  return days + d;
}

// Devuelve SOLO el año hebreo a partir del día absoluto
export function absoluteToHebrewYear(abs) {
  let year = Math.floor((abs + 1373429) / 365.2468);

  // Ajuste fino: corrige si nos pasamos o quedamos cortos
  while (hebrewToAbsolute(year + 1, 1, 1) <= abs) {
    year++;
  }
  while (hebrewToAbsolute(year, 1, 1) > abs) {
    year--;
  }

  return year;
}