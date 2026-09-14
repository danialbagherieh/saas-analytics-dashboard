// src/components/ReportInsights/Timeline.tsx
import React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { Skeleton, Box } from "@mui/material";

import ErrorOutline from "@mui/icons-material/ErrorOutline";
import BugReport from "@mui/icons-material/BugReport";
import CheckCircle from "@mui/icons-material/CheckCircle";
import AssignmentInd from "@mui/icons-material/AssignmentInd";

// 👇 Export the TimelineEvent type for parent use
export interface TimelineEvent {
  id: number;
  date: string;
  time?: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  severity?: "error" | "warning" | "success" | "info";
  chip?: { label: string; color: "error" | "warning" | "success" | "default" };
}

// 👇 Props interface – added onEventClick
interface TimelineProps {
  events?: TimelineEvent[];
  loading?: boolean;
  onEventClick?: (event: TimelineEvent) => void; // 👈 NEW
}

// 👇 Default fallback events
const defaultEvents: TimelineEvent[] = [
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

// 👇 Map severity to dot color
const getDotColor = (
  severity?: string,
): "error" | "warning" | "success" | "info" | "primary" | "secondary" => {
  switch (severity) {
    case "error":
      return "error";
    case "warning":
      return "warning";
    case "success":
      return "success";
    case "info":
      return "info";
    default:
      return "primary";
  }
};

export default function CustomizedTimeline({
  events = defaultEvents,
  loading = false,
  onEventClick, // 👈 NEW
}: TimelineProps) {
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width={200} height={40} />
        {[1, 2, 3, 4].map((i) => (
          <Box key={i} sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Timeline position="alternate">
      <Typography variant="h6" sx={{ mb: 1 }}>
        Incident Timeline
      </Typography>

      {events.map((event, index) => (
        <TimelineItem
          key={event.id}
          sx={{ cursor: "pointer" }}
          onClick={() => onEventClick?.(event)} // 👈 Click handler
        >
          <TimelineOppositeContent
            sx={{
              m: "auto 0",
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              alignItems: index % 2 === 0 ? "flex-end" : "flex-start",
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              {event.date}
            </Typography>
            {event.time && (
              <Typography variant="caption" color="text.secondary">
                {event.time}
              </Typography>
            )}
          </TimelineOppositeContent>

          <TimelineSeparator>
            {index > 0 && <TimelineConnector />}
            <TimelineDot color={getDotColor(event.severity)}>
              {event.icon}
            </TimelineDot>
            {index < events.length - 1 && <TimelineConnector />}
          </TimelineSeparator>

          <TimelineContent sx={{ m: "auto 0" }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {event.title}
            </Typography>
            {event.chip && (
              <Chip
                label={event.chip.label}
                color={event.chip.color}
                size="small"
                sx={{ my: 0.5, cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent double trigger
                  onEventClick?.(event);
                }}
              />
            )}
            <Typography variant="body2" color="text.secondary">
              {event.description}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
