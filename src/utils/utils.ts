export const offset = new Date().getTimezoneOffset();

export function MS(minutes: number, seconds = 0): number {
  return 1000 * 60 * (minutes + seconds / 60); // X minutes
}
MS.day = 1000 * 60 * 60 * 24; // 24 day
MS.hour = 1000 * 60 * 60; // 1 hour

export const timeout = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
