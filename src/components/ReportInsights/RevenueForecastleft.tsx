// src/components/ReportInsights/RevenueForecastleft.tsx
import { useMemo, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  Card,
  CardHeader,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography,
  Skeleton,
} from "@mui/material";
import type { RevenuePoint } from "./revenueForecastData";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface RevenueForecastProps {
  forecastData?: RevenuePoint[];
  loading?: boolean;
}

export default function RevenueForecast({
  forecastData,
  loading = false,
}: RevenueForecastProps) {
  const [scenario, setScenario] = useState<
    "baseline" | "optimistic" | "pessimistic"
  >("baseline");

  const { actualRevenue, forecasts } = useMemo(() => {
    if (!forecastData || forecastData.length === 0) {
      return {
        actualRevenue: Array(12).fill(null),
        forecasts: {
          baseline: Array(12).fill(null),
          optimistic: Array(12).fill(null),
          pessimistic: Array(12).fill(null),
        },
      };
    }

    const actual = forecastData.map((d) => d.actual);
    const baseline = forecastData.map((d) => d.baseline);
    const optimistic = forecastData.map((d) => d.optimistic);
    const pessimistic = forecastData.map((d) => d.pessimistic);

    return {
      actualRevenue: actual,
      forecasts: { baseline, optimistic, pessimistic },
    };
  }, [forecastData]);

  if (loading) {
    return (
      <Card sx={{ width: "100%", boxShadow: 3 }}>
        <CardHeader title="Revenue Forecast" />
        <CardContent>
          <Skeleton variant="rectangular" height={440} />
        </CardContent>
      </Card>
    );
  }

  const chosenForecast = forecasts[scenario];
  const chartHeight = 440;

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxShadow: 3,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <CardHeader
        title="Revenue Forecast (Actual vs Forecast)"
        subheader="Monthly Recurring Revenue (MRR) — Actual vs Forecast (in $k)"
        sx={{ pb: 0 }}
      />

      <CardContent
        sx={{
          p: { xs: 1, sm: 2 },
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        {/* Controls row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 1,
            mb: 1,
          }}
        >
          <ToggleButtonGroup
            value={scenario}
            exclusive
            onChange={(_, v) => v && setScenario(v)}
            size="small"
            aria-label="forecast scenario"
          >
            <ToggleButton value="baseline">Baseline</ToggleButton>
            <ToggleButton value="optimistic">Optimistic</ToggleButton>
            <ToggleButton value="pessimistic">Pessimistic</ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="caption" color="text.secondary">
              Values in $k
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Projection starts Sep
            </Typography>
          </Box>
        </Box>

        {/* 🔑 SIMPLE: chart fills parent, scales naturally */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <LineChart
            xAxis={[
              {
                data: MONTHS,
                scaleType: "point",
                label: "Month",
              },
            ]}
            series={[
              {
                label: "Actual Revenue",
                data: actualRevenue,
                area: true,
                color: "#1976d2",
                showMark: true,
                curve: "monotoneX",
              },
              {
                label: `${scenario.charAt(0).toUpperCase() + scenario.slice(1)} Forecast`,
                data: chosenForecast,
                area: true,
                color:
                  scenario === "optimistic"
                    ? "#2e7d32"
                    : scenario === "pessimistic"
                      ? "#ef6c00"
                      : "#0288d1",
                showMark: false,
                curve: "monotoneX",
              },
            ]}
            height={chartHeight}
            margin={{ top: 20, right: 50, bottom: 30, left: 10 }}
            grid={{ horizontal: true }}
            sx={{
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              "& .MuiChartsAxis-label": { fontWeight: 600 },
              "& .MuiChartsLegend-root": { mb: 1 },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
