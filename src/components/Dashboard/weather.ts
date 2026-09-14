export type WeatherRecord = {
  month: string;
  london: number;
  paris: number;
  newYork: number;
  seoul: number;
};

export const dataset: WeatherRecord[] = [
  { month: 'Jan', london: 49, paris: 63, newYork: 78, seoul: 46 },
  { month: 'Feb', london: 58, paris: 59, newYork: 60, seoul: 50 },
  { month: 'Mar', london: 62, paris: 55, newYork: 66, seoul: 52 },
  { month: 'Apr', london: 55, paris: 48, newYork: 58, seoul: 64 },
  { month: 'May', london: 44, paris: 41, newYork: 70, seoul: 72 },
  { month: 'Jun', london: 50, paris: 60, newYork: 65, seoul: 80 },
  { month: 'Jul', london: 45, paris: 52, newYork: 72, seoul: 78 },
  { month: 'Aug', london: 48, paris: 57, newYork: 69, seoul: 74 },
  { month: 'Sep', london: 60, paris: 62, newYork: 71, seoul: 68 },
  { month: 'Oct', london: 66, paris: 70, newYork: 75, seoul: 60 },
  { month: 'Nov', london: 72, paris: 65, newYork: 68, seoul: 58 },
  { month: 'Dec', london: 75, paris: 70, newYork: 80, seoul: 62 },
];

export const valueFormatter = (value: number | null) =>
  value == null ? '' : `${value} mm`;


