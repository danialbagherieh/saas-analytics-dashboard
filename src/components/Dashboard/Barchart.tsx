// src/components/pagedashboard/Barchart.tsx
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { valueFormatter } from "./weather";

// 👇 Import the WeatherRecord type from weather.ts
import type { WeatherRecord } from "./weather";

// 👇 Define props interface
interface BarchartProps {
  dataset?: WeatherRecord[];
  loading?: boolean;
}

// 👇 Default dataset (fallback if no props)
import { dataset as defaultDataset } from "./weather";

const vf = (v: number | null) => (v == null ? "" : valueFormatter(v));

export default function Barchart({
  dataset = defaultDataset,
  loading = false,
}: BarchartProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // 👇 Responsive height based on screen size
  const chartHeight = isMobile ? 250 : isTablet ? 320 : 400;

  if (loading) {
    return (
      <Box sx={{ width: "100%", height: chartHeight }}>
        <Skeleton
          variant="rectangular"
          height={chartHeight}
          sx={{ borderRadius: 2 }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: chartHeight }}>
      <BarChart
        dataset={dataset}
        xAxis={[{ dataKey: "month" }]}
        series={[
          { dataKey: "london", label: "London", valueFormatter: vf },
          { dataKey: "paris", label: "Paris", valueFormatter: vf },
          { dataKey: "newYork", label: "New York", valueFormatter: vf },
          { dataKey: "seoul", label: "Seoul", valueFormatter: vf },
        ]}
        yAxis={[
          {
            label: isMobile ? "" : "rainfall (mm)",
            width: isMobile ? 30 : 50,
          },
        ]}
        height={chartHeight}
        margin={{
          top: 20,
          right: 10,
          bottom: isMobile ? 40 : 30,
          left: isMobile ? 10 : 20,
        }}
        slotProps={{
          legend: {
            position: {
              vertical: "bottom",
              horizontal: "center",
            },
          },
        }}
      />
    </Box>
  );
}
