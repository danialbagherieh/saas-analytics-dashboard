// src/pages/ReportInsights.tsx
import { useState, useEffect } from "react";
import { Box, Grid, Snackbar, Alert } from "@mui/material";

import RevenueForecast from "../components/ReportInsights/RevenueForecastleft";
import ForecastScenarios from "../components/ReportInsights/ForecastScenariosright";
import Keymetrics, {
  type Metric,
} from "../components/ReportInsights/Keymetrics";
import CustomizedTimeline, {
  type TimelineEvent,
} from "../components/ReportInsights/Timeline";

import {
  revenueForecastDataset,
  type RevenuePoint,
} from "../components/ReportInsights/revenueForecastData";

// Icons for default metrics
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import PetsIcon from "@mui/icons-material/Pets";
import PersonIcon from "@mui/icons-material/Person";
import WarningIcon from "@mui/icons-material/Warning";
import LandscapeIcon from "@mui/icons-material/Landscape";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import BugReport from "@mui/icons-material/BugReport";
import CheckCircle from "@mui/icons-material/CheckCircle";
import AssignmentInd from "@mui/icons-material/AssignmentInd";

const defaultMetrics: Metric[] = [
  {
    id: 1,
    title: "Plants",
    description: "Plants are essential for all life.",
    delta: 12.5,
    spark: [2, 4, 3, 6, 8, 7, 9],
    icon: <LocalFloristIcon />,
    color: "#1976d2",
  },
  {
    id: 2,
    title: "Animals",
    description: "Animals are a part of nature.",
    delta: -3.2,
    spark: [5, 6, 5, 7, 6, 8, 9],
    icon: <PetsIcon />,
    color: "#2e7d32",
  },
  {
    id: 3,
    title: "Humans",
    description: "Humans depend on plants and animals for survival.",
    delta: 4.1,
    spark: [3, 4, 6, 5, 7, 8, 10],
    icon: <PersonIcon />,
    color: "#1565c0",
  },
  {
    id: 4,
    title: "Ecosystem",
    description: "Overall ecosystem score.",
    delta: -1.1,
    spark: [1, 2, 3, 2, 4, 5, 6],
    icon: <LandscapeIcon />,
    color: "#388e3c",
  },
  {
    id: 5,
    title: "Threat Index",
    description: "Current threat level.",
    delta: 2.8,
    spark: [8, 7, 6, 7, 8, 9, 10],
    icon: <WarningIcon />,
    color: "#d32f2f",
  },
  {
    id: 6,
    title: "Habitats",
    description: "Protected habitat areas.",
    delta: 0.9,
    spark: [4, 5, 4, 6, 7, 6, 8],
    icon: <LandscapeIcon />,
    color: "#2e7d32",
  },
];

const defaultTimelineEvents: TimelineEvent[] = [
  {
    id: 1,
    date: "Feb 10, 2026",
    time: "09:30",
    title: "Detection",
    description:
      "Revenue dropped by 20% — triggered alert from analytics dashboard",
    icon: <ErrorOutline />,
    severity: "error",
    chip: { label: "High Severity", color: "error" },
  },
  {
    id: 2,
    date: "Feb 10, 2026",
    time: "09:32",
    title: "Acknowledged",
    description: "Incident assigned to Jane Doe — MTTA: 2 minutes",
    icon: <BugReport />,
    severity: "warning",
  },
  {
    id: 3,
    date: "Feb 10, 2026",
    time: "10:00",
    title: "Investigation",
    description:
      "Analyzed conversion funnel — drop traced to checkout page error",
    icon: <CheckCircle />,
    severity: "info",
  },
  {
    id: 4,
    date: "Feb 11, 2026",
    time: "08:15",
    title: "Resolution",
    description:
      "Root cause: broken checkout script — fix deployed, incident closed",
    icon: <AssignmentInd />,
    severity: "success",
  },
];

export default function ReportInsights() {
  const [forecastData, setForecastData] = useState<RevenuePoint[]>(
    revenueForecastDataset,
  );
  const [metrics, setMetrics] = useState<Metric[]>(defaultMetrics);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(
    defaultTimelineEvents,
  );
  const [loading, setLoading] = useState(true);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setForecastData(revenueForecastDataset);
      setMetrics(defaultMetrics);
      setTimelineEvents(defaultTimelineEvents);
      setLoading(false);
    }, 800);
  }, []);

  const handleCardClick = (metricId: number) => {
    const metric = metrics.find((m) => m.id === metricId);
    if (metric) {
      setSnackbar({
        open: true,
        message: `Clicked on "${metric.title}" – Delta: ${metric.delta}%`,
        severity: "info",
      });
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 1.5, md: 2 },
        bgcolor: "#f7f9fc",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflowX: "hidden", // 🔑 page never scrolls horizontally
        boxSizing: "border-box",
        minHeight: "100vh",
      }}
    >
      {/* Row 1: Revenue Forecast + Forecast Scenarios */}
      <Grid container spacing={2} sx={{ mt: { xs: 1, sm: 2 } }}>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ minWidth: 0, maxWidth: "100%", overflow: "hidden" }} // 🔑
        >
          <RevenueForecast forecastData={forecastData} loading={loading} />
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ minWidth: 0, maxWidth: "100%", overflow: "hidden" }} // 🔑
        >
          <ForecastScenarios dataset={forecastData} loading={loading} />
        </Grid>
      </Grid>

      {/* Row 2: Key Metrics + Timeline */}
      <Grid container spacing={2} sx={{ mt: { xs: 1, sm: 2 } }}>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ minWidth: 0, maxWidth: "100%", overflow: "hidden" }} // 🔑
        >
          <Keymetrics
            metrics={metrics}
            loading={loading}
            onCardClick={handleCardClick}
          />
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ minWidth: 0, maxWidth: "100%", overflow: "hidden" }} // 🔑
        >
          <CustomizedTimeline events={timelineEvents} loading={loading} />
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
