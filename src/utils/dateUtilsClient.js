// src/utils/dateUtilsClient.js
export function isoDateString(d) {
    const date = d ? new Date(d) : new Date();
    date.setHours(0,0,0,0);
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${day}`;
  }