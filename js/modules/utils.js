// ===============================
// utils.js
// ===============================
export function getDiffDays(selectedDate) {
  const today = new Date();
  const target = new Date(selectedDate);
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function formatDate(dateObj) {
  return dateObj.toISOString().split("T")[0];
}

// ===============================
// utilsNasa.js
// ===============================
export function yyyymmddToDate(yyyymmdd) {
  const y = Number(yyyymmdd.slice(0, 4));
  const m = Number(yyyymmdd.slice(4, 6)) - 1;
  const d = Number(yyyymmdd.slice(6, 8));
  return new Date(Date.UTC(y, m, d));
}

export function getDOY(dateObj) {
  const start = new Date(Date.UTC(dateObj.getUTCFullYear(), 0, 1));
  const diff = (dateObj - start) / (1000 * 60 * 60 * 24);
  return Math.floor(diff) + 1;
}

