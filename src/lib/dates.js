export function getToday() {
  const now = new Date();
  return formatDateKey(now);
}

export function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isToday(dateKey) {
  return dateKey === getToday();
}

export function isFuture(dateKey) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = parseDateKey(dateKey);
  return target.getTime() > today.getTime();
}

export function isPast(dateKey) {
  return !isToday(dateKey) && !isFuture(dateKey);
}

export function getDayOfYear(dateKey) {
  const date = parseDateKey(dateKey);
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

export function getYearDates(year) {
  const dates = [];
  const totalDays = getDaysInYear(year);
  const start = new Date(year, 0, 1);
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(formatDateKey(date));
  }
  return dates;
}

export function getCurrentYear() {
  return new Date().getFullYear();
}

export function formatDisplayDate(dateKey) {
  const date = parseDateKey(dateKey);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(dateKey) {
  const date = parseDateKey(dateKey);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function isValidDateKey(dateKey) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return false;
  const date = parseDateKey(dateKey);
  return !isNaN(date.getTime()) && formatDateKey(date) === dateKey;
}
