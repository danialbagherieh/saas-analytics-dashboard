// src/components/ReportInsights/ForecastScenariosright.tsx
import {
  areaElementClasses,
  LineChart,
  lineElementClasses,
} from "@mui/x-charts/LineChart";
import { Box, Typography, Skeleton } from "@mui/material";
import type { RevenuePoint } from "./revenueForecastData.tsx";

interface ForecastScenariosProps {
  dataset?: RevenuePoint[];
  loading?: boolean;
}

import { revenueForecastDataset } from "./revenueForecastData.tsx";

export default function ForecastScenarios({
  dataset = revenueForecastDataset,
  loading = false,
}: ForecastScenariosProps) {
  if (loading) {
    return (
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          background: "white",
          boxShadow: 3,
          p: 2,
        }}
      >
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton variant="rectangular" height={500} sx={{ mt: 2 }} />
      </Box>
    );
  }

  // ✅ FIXED: Full-length array (12 items), actual values Jan–Aug, null for Sep–Dec
  const actualData = dataset.map((point, index) => {
    return index < 8 ? point.actual : null;
  });

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        background: "white",
        boxShadow: 3,
        p: 2,
      }}
    >
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
        Scenario Comparison
      </Typography>

      <LineChart
        dataset={dataset}
        sx={{
          [`& .${lineElementClasses.root}[data-series="actual"]`]: {
            strokeWidth: 3.5,
            strokeDasharray: "none",
          },
          [`& .${lineElementClasses.root}[data-series="baseline"]`]: {
            strokeDasharray: "6 4",
            strokeWidth: 3,
          },
          [`& .${lineElementClasses.root}[data-series="optimistic"]`]: {
            strokeDasharray: "6 4",
            strokeWidth: 3,
          },
          [`& .${lineElementClasses.root}[data-series="pessimistic"]`]: {
            strokeDasharray: "6 4",
            strokeWidth: 3,
          },
          [`& .${areaElementClasses.root}[data-series="baseline"]`]: {
            fill: "url('#baselineGradient')",
            opacity: 0.12,
          },
          [`& .${areaElementClasses.root}[data-series="optimistic"]`]: {
            fill: "url('#optimisticGradient')",
            opacity: 0.1,
          },
          [`& .${areaElementClasses.root}[data-series="pessimistic"]`]: {
            fill: "url('#pessimisticGradient')",
            opacity: 0.1,
          },
        }}
        xAxis={[
          {
            dataKey: "date",
            scaleType: "time",
            valueFormatter: (date: Date) =>
              date.toLocaleString(undefined, {
                month: "short",
                year: "2-digit",
              }),
          },
        ]}
        yAxis={[
          {
            width: 80,
            valueFormatter: (v: number) => `${v}k`,
          },
        ]}
        series={[
          {
            id: "actual",
            label: "Actual Revenue",
            data: actualData,
            showMark: true,
            color: "#1976d2",
            connectNulls: false, // 👈 This stops the line at September
          },
          {
            id: "baseline",
            label: "Baseline Forecast",
            dataKey: "baseline",
            area: true,
            color: "#0288d1",
          },
          {
            id: "optimistic",
            label: "Optimistic Forecast",
            dataKey: "optimistic",
            area: true,
            color: "#2e7d32",
          },
          {
            id: "pessimistic",
            label: "Pessimistic Forecast",
            dataKey: "pessimistic",
            area: true,
            color: "#ef6c00",
          },
        ]}
        slotProps={{
          legend: {
            position: { vertical: "top" },
          },
          tooltip: {
            trigger: "axis",
          },
        }}
        experimentalFeatures={{ preferStrictDomainInLineCharts: true }}
        height={500}
        margin={{ top: 24, right: 24, bottom: 20, left: 5 }}
        grid={{ horizontal: true }}
      >
        <defs>
          <linearGradient id="baselineGradient" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="#0288d1" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0288d1" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient
            id="optimisticGradient"
            gradientTransform="rotate(90)"
          >
            <stop offset="0%" stopColor="#2e7d32" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#2e7d32" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient
            id="pessimisticGradient"
            gradientTransform="rotate(90)"
          >
            <stop offset="0%" stopColor="#ef6c00" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#ef6c00" stopOpacity="0.02" />
          </linearGradient>
        </defs>
      </LineChart>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1 }}
      >
        * Actual revenue shown for Jan–Aug. Forecast from Sep onwards.
      </Typography>
    </Box>
  );
}
