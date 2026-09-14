// src/components/Dashboard/PieChartWithCenterLabel.tsx
import React, { useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

export interface WeeklySellItem {
  product: string;
  mon: number;
  tue: number;
  wed: number;
  color: string;
}

interface PieChartWithCenterLabelProps {
  weeklySales?: WeeklySellItem[];
  loading?: boolean;
}

const defaultWeeklySales: WeeklySellItem[] = [
  { product: "Social", mon: 5, tue: 7, wed: 6, color: "green" },
  { product: "Search Engines", mon: 10, tue: 8, wed: 9, color: "#1976d2" },
  { product: "Direct", mon: 15, tue: 12, wed: 14, color: "#ffb300" },
  { product: "Other", mon: 20, tue: 18, wed: 19, color: "#d32f2f" },
];

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 16,
  fontWeight: 700,
}));

function PieCenterLabel({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <g>
      <StyledText x={left + width / 2} y={top + height / 2 - 8}>
        {title}
      </StyledText>
      {subtitle && (
        <text
          x={left + width / 2}
          y={top + height / 2 + 14}
          fill="#666"
          fontSize={12}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {subtitle}
        </text>
      )}
    </g>
  );
}

export default function PieChartWithCenterLabel({
  weeklySales = defaultWeeklySales,
  loading = false,
}: PieChartWithCenterLabelProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const chartWidth = isMobile ? 240 : 230;
  const chartHeight = isMobile ? 240 : 230;

  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  if (loading) {
    return (
      <Box sx={{ width: "100%", p: 1 }}>
        <Skeleton variant="rectangular" height={340} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  const pieData = weeklySales.map((r) => ({
    label: r.product,
    value: r.mon + r.tue + r.wed,
    color: r.color,
  }));

  const series = [
    {
      data: pieData.map((d) => ({
        value: d.value,
        label: d.label,
        color: d.color,
      })),
      innerRadius: isMobile ? 60 : 75,
      cornerRadius: 4,
      paddingAngle: 2,
    },
  ];

  const total = pieData.reduce((s, p) => s + p.value, 0);
  const activeId = selected ?? hovered;
  const active = activeId
    ? (pieData.find((p) => p.label === activeId) ?? null)
    : null;
  const activePct = active ? Math.round((active.value / total) * 100) : null;

  const fmtNumber = (n: number) => n.toLocaleString();

  const handleChipKey = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelected((prev) => (prev === id ? null : id));
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        width: "100%",
        borderRadius: 3,
        p: 2,
        mt: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: 0.5,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          Weekly Sales Distribution
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Click a legend chip to pin
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <PieChart
          series={series}
          width={chartWidth}
          height={chartHeight}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          slots={{ legend: () => null }}
        >
          <PieCenterLabel
            title={active ? `${active.label} • ${activePct}%` : `Total • 100%`}
            subtitle={active ? fmtNumber(active.value) : fmtNumber(total)}
          />
        </PieChart>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {pieData.map((p) => {
          const isActive = activeId === p.label;
          return (
            <Chip
              key={p.label}
              label={`${p.label} • ${Math.round((p.value / total) * 100)}%`}
              size="small"
              onMouseEnter={() => setHovered(p.label)}
              onMouseLeave={() => setHovered(null)}
              onClick={() =>
                setSelected((prev) => (prev === p.label ? null : p.label))
              }
              onKeyDown={(e) => handleChipKey(e, p.label)}
              tabIndex={0}
              role="button"
              aria-pressed={selected === p.label}
              sx={{
                bgcolor: isActive ? p.color : "rgba(0,0,0,0.04)",
                color: isActive ? "#fff" : "text.primary",
                fontWeight: 700,
                border: isActive
                  ? `1px solid ${p.color}`
                  : "1px solid transparent",
                cursor: "pointer",
                transform: isActive ? "translateY(-2px)" : "none",
                transition: "transform 160ms ease, box-shadow 160ms ease",
                "&:focus": {
                  boxShadow: (theme) =>
                    `0 0 0 3px ${theme.palette.action.focus}`,
                },
              }}
            />
          );
        })}
      </Box>
    </Paper>
  );
}
