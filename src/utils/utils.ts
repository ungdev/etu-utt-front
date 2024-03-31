export function roundToStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
export const DAY_LENGTH = 24 * 3_600_000;