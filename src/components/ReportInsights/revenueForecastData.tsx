
export type RevenuePoint = {
  date: Date;
  actual: number | null;
  baseline: number | null;
  optimistic: number | null;
  pessimistic: number | null;
};

export const revenueForecastDataset: RevenuePoint[] = [
  {
    date: new Date("2025-01-01"),
    actual: 45,
    baseline: 45,
    optimistic: 48,
    pessimistic: 42,
  },
  {
    date: new Date("2025-02-01"),
    actual: 48,
    baseline: 48,
    optimistic: 53,
    pessimistic: 44,
  },
  {
    date: new Date("2025-03-01"),
    actual: 52,
    baseline: 52,
    optimistic: 58,
    pessimistic: 48,
  },
  {
    date: new Date("2025-04-01"),
    actual: 55,
    baseline: 55,
    optimistic: 62,
    pessimistic: 50,
  },
  {
    date: new Date("2025-05-01"),
    actual: 60,
    baseline: 60,
    optimistic: 67,
    pessimistic: 55,
  },
  {
    date: new Date("2025-06-01"),
    actual: 64,
    baseline: 64,
    optimistic: 72,
    pessimistic: 59,
  },
  {
    date: new Date("2025-07-01"),
    actual: 68,
    baseline: 68,
    optimistic: 76,
    pessimistic: 63,
  },
  {
    date: new Date("2025-08-01"),
    actual: 72,
    baseline: 72,
    optimistic: 81,
    pessimistic: 66,
  },
  {
    date: new Date("2025-09-01"),
    actual: null,
    baseline: 75,
    optimistic: 84,
    pessimistic: 69,
  },
  {
    date: new Date("2025-10-01"),
    actual: null,
    baseline: 78,
    optimistic: 87,
    pessimistic: 72,
  },
  {
    date: new Date("2025-11-01"),
    actual: null,
    baseline: 82,
    optimistic: 92,
    pessimistic: 76,
  },
  {
    date: new Date("2025-12-01"),
    actual: null,
    baseline: 86,
    optimistic: 97,
    pessimistic: 80,
  },
];
