// utils/dateUtils.js
// Utilities for normalizing dates. Adjust timezone strategy if needed.

export function normalizeToDay(d) {
    // Accept Date or string. Produce Date at local 00:00:00
    const date = d ? new Date(d) : new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }
  
  export function isoDateString(d) {
    // returns YYYY-MM-DD (local) — useful as key on frontend
    const date = normalizeToDay(d);
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${day}`;
  }