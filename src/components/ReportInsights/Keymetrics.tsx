// src/components/ReportInsights/Keymetrics.tsx
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { green, red, blue } from "@mui/material/colors";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { Skeleton } from "@mui/material";

// MUI icons
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import PetsIcon from "@mui/icons-material/Pets";
import PersonIcon from "@mui/icons-material/Person";
import WarningIcon from "@mui/icons-material/Warning";
import LandscapeIcon from "@mui/icons-material/Landscape";

// 👇 Export the Metric type for parent use
export interface Metric {
  id: number;
  title: string;
  description: string;
  delta: number;
  spark: number[];
  icon: React.ReactNode;
  color: string;
}

// 👇 Props interface
interface KeymetricsProps {
  metrics?: Metric[];
  loading?: boolean;
  onCardClick?: (metricId: number) => void;
}

// 👇 Default fallback data (used if no props passed)
const defaultMetrics: Metric[] = [
  {
    id: 1,
    title: "Plants",
    description: "Plants are essential for all life.",
    delta: 12.5,
    spark: [2, 4, 3, 6, 8, 7, 9],
    icon: <LocalFloristIcon />,
    color: blue[600],
  },
  {
    id: 2,
    title: "Animals",
    description: "Animals are a part of nature.",
    delta: -3.2,
    spark: [5, 6, 5, 7, 6, 8, 9],
    icon: <PetsIcon />,
    color: green[600],
  },
  {
    id: 3,
    title: "Humans",
    description: "Humans depend on plants and animals for survival.",
    delta: 4.1,
    spark: [3, 4, 6, 5, 7, 8, 10],
    icon: <PersonIcon />,
    color: blue[800],
  },
  {
    id: 4,
    title: "Ecosystem",
    description: "Overall ecosystem score.",
    delta: -1.1,
    spark: [1, 2, 3, 2, 4, 5, 6],
    icon: <LandscapeIcon />,
    color: green[700],
  },
  {
    id: 5,
    title: "Threat Index",
    description: "Current threat level.",
    delta: 2.8,
    spark: [8, 7, 6, 7, 8, 9, 10],
    icon: <WarningIcon />,
    color: red[600],
  },
  {
    id: 6,
    title: "Habitats",
    description: "Protected habitat areas.",
    delta: 0.9,
    spark: [4, 5, 4, 6, 7, 6, 8],
    icon: <LandscapeIcon />,
    color: green[800],
  },
];

export default function Keymetrics({
  metrics = defaultMetrics,
  loading = false,
  onCardClick,
}: KeymetricsProps) {
  const [selectedCard, setSelectedCard] = useState(0);

  // 👇 Show loading skeleton
  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 2,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} sx={{ height: 200 }}>
            <CardContent>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="rectangular" height={50} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 2,
      }}
    >
      {metrics.map((card, index) => {
        const isPositive = card.delta >= 0;

        return (
          <Card key={card.id} sx={{ height: 200 }}>
            <CardActionArea
              onClick={() => {
                setSelectedCard(index);
                onCardClick?.(card.id);
              }}
              data-active={selectedCard === index ? "" : undefined}
              sx={{
                height: "100%",
                "&[data-active]": {
                  backgroundColor: "action.selected",
                },
              }}
            >
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {/* Header row: icon + title + delta badge */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ bgcolor: card.color, width: 32, height: 32 }}>
                      {card.icon}
                    </Avatar>
                    <Typography variant="h6">{card.title}</Typography>
                  </Stack>

                  <Chip
                    label={`${isPositive ? "▲" : "▼"} ${Math.abs(card.delta)}%`}
                    size="small"
                    sx={{
                      bgcolor: isPositive ? green[50] : red[50],
                      color: isPositive ? green[700] : red[700],
                      fontWeight: 600,
                    }}
                  />
                </Stack>

                {/* Description */}
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>

                {/* Sparkline */}
                <Box sx={{ mt: "auto" }}>
                  <SparkLineChart
                    data={card.spark}
                    width={140}
                    height={50}
                    color={card.color}
                    area
                  />
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </Box>
  );
}
