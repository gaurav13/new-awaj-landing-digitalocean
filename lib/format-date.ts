const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

export function dateParts(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date
  return {
    month: MONTHS[d.getUTCMonth()],
    day: String(d.getUTCDate()).padStart(2, "0"),
    year: String(d.getUTCFullYear()),
  }
}

export function formatLongDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}
