import { DateKey } from "@/types";

export function getToday(): DateKey {
  const now = new Date();
  return formatDateKey(now);
}

export function formatDateKey(date: Date): DateKey {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(dateKey: DateKey): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isToday(dateKey: DateKey): boolean {
  return dateKey === getToday();
}

export function isFuture(dateKey: DateKey): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = parseDateKey(dateKey);
  return target.getTime() > today.getTime();
}

export function isPast(dateKey: DateKey): boolean {
  return !isToday(dateKey) && !isFuture(dateKey);
}

export function getDayOfYear(dateKey: DateKey): number {
  const date = parseDateKey(dateKey);
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

export function getYearDates(year: number): DateKey[] {
  const dates: DateKey[] = [];
  const totalDays = getDaysInYear(year);
  const start = new Date(year, 0, 1);

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(formatDateKey(date));
  }

  return dates;
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function formatDisplayDate(dateKey: DateKey): string {
  const date = parseDateKey(dateKey);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(dateKey: DateKey): string {
  const date = parseDateKey(dateKey);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function isValidDateKey(dateKey: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return false;
  const date = parseDateKey(dateKey);
  return !isNaN(date.getTime()) && formatDateKey(date) === dateKey;
}
