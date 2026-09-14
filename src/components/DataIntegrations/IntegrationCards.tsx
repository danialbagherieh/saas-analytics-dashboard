import React from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// Define the props for each card configuration
interface CardConfig {
  id: string;
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "primary" | "success" | "error";
  subtitle: string;
}

// Default values if no props are passed (fallback)
const defaultData = {
  total: 12,
  active: 9,
  failed: 2,
};

interface IntegrationStatsCardsProps {
  total?: number;
  active?: number;
  failed?: number;
}

export default function IntegrationStatsCards({
  total = defaultData.total,
  active = defaultData.active,
  failed = defaultData.failed,
}: IntegrationStatsCardsProps) {
  // Build card configurations from props
  const cardConfigs: CardConfig[] = [
    {
      id: "total",
      title: "Total Integrations",
      value: total,
      icon: <LinkIcon color="primary" />,
      color: "primary",
      subtitle: "Connected data sources",
    },
    {
      id: "active",
      title: "Active Integrations",
      value: active,
      icon: <CheckCircleIcon color="success" />,
      color: "success",
      subtitle: "Currently connected",
    },
    {
      id: "failed",
      title: "Failed Integrations",
      value: failed,
      icon: <ErrorOutlineIcon color="error" />,
      color: "error",
      subtitle: "Requires attention",
    },
  ];

  return (
    <Grid container spacing={3}>
      {cardConfigs.map((card) => (
        <Grid key={card.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: 140, borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {card.title}
                </Typography>
                {card.icon}
              </Box>

              <Typography
                variant="h4"
                fontWeight="bold"
                color={
                  card.color === "primary"
                    ? "text.primary"
                    : `${card.color}.main`
                }
              >
                {card.value}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {card.subtitle}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
