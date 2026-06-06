/* Returns YYYY-MM-DD string for any Date object */
export function toDateString(date) {
  return date.toISOString().split("T")[0];
}

/* Returns { from, to } for the current calendar month */
export function getCurrentMonthRange() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    from: toDateString(from),
    to: toDateString(to),
  };
}

/* Returns true if a transaction date falls within the range */
export function isInRange(dateString, from, to) {
  const date = new Date(dateString);
  const fromDate = new Date(from);
  const toDate = new Date(to);
  // set toDate to end of day so inclusive
  toDate.setHours(23, 59, 59, 999);
  return date >= fromDate && date <= toDate;
}