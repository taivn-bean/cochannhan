// Constants để dễ maintain
export const CACHE_TIME = {
  PERMANENT: Infinity,
  ONE_MINUTE: 1000 * 60,
  FIVE_MINUTES: 1000 * 60 * 5,
  THIRTY_MINUTES: 1000 * 60 * 30,
  ONE_HOUR: 1000 * 60 * 60,
  SIX_HOURS: 1000 * 60 * 60 * 6,
  ONE_DAY: 1000 * 60 * 60 * 24,
  ONE_WEEK: 1000 * 60 * 60 * 24 * 7,
  ONE_MONTH: 1000 * 60 * 60 * 24 * 30,
} as const;
