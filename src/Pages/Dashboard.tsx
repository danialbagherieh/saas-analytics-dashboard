// src/pages/Dashboard/Dashboard.tsx
import {
  Box,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

import {
  RevenueCard,
  ActiveUsersCard,
  ServerUptimeCard,
  TaskCompletionCard,
} from "../components/Dashboard/DashboardCards.tsx";
import DataGridDemo from "../components/Dashboard/DataGridDemo/DataGridDemo.tsx";
import Barchart from "../components/Dashboard/Barchart.tsx";
import PieChartWithCenterLabel from "../components/Dashboard/PieChartWithCenterLabel.tsx";
import Map from "../Earth/Map.tsx";

import { useDashboard } from "./Rules/RulesDashboard.tsx";

import WeeklySellsTable from "../components/Dashboard/WeeklySellsTable.tsx";

export default function ElegantSaaSDashboard() {
  const {
    cardData,
    tableRows,
    weatherData,
    weeklySales,
    loading,
    dialogOpen,
    dialogTitle,
    dialogContent,
    refreshRevenue,
    refreshUsers,
    refreshUptime,
    refreshTaskCompletion,
    viewDetails,
    closeDialog,
    exportData,
  } = useDashboard();

  // 👇 Card configs — avoids repeating JSX 4 times
  const cards = [
    {
      Component: RevenueCard,
      props: {
        revenue: cardData.revenue,
        growth: cardData.revenueGrowth,
        onRefresh: refreshRevenue,
        onViewDetails: () =>
          viewDetails(
            "Revenue Details",
            `Monthly Revenue: $${cardData.revenue.toLocaleString()}\nGrowth: ${cardData.revenueGrowth}\nProjected next month: $${Math.round(cardData.revenue * 1.05).toLocaleString()}`,
          ),
        onExport: () => exportData("revenue"),
      },
    },
    {
      Component: ActiveUsersCard,
      props: {
        users: cardData.users,
        growth: cardData.usersGrowth,
        onRefresh: refreshUsers,
        onViewDetails: () =>
          viewDetails(
            "Active Users Details",
            `Active Users: ${cardData.users.toLocaleString()}\nGrowth: ${cardData.usersGrowth}\nNew signups this month: ${Math.round(cardData.users * 0.08)}`,
          ),
        onExport: () => exportData("users"),
      },
    },
    {
      Component: ServerUptimeCard,
      props: {
        uptime: cardData.uptime,
        status: cardData.uptimeStatus,
        onRefresh: refreshUptime,
        onViewDetails: () =>
          viewDetails(
            "Server Uptime Details",
            `Current Uptime: ${cardData.uptime}\nStatus: ${cardData.uptimeStatus}\nAverage response time: ${(120 + Math.random() * 80).toFixed(0)}ms`,
          ),
        onExport: () => exportData("uptime"),
      },
    },
    {
      Component: TaskCompletionCard,
      props: {
        completion: cardData.taskCompletion,
        onRefresh: refreshTaskCompletion,
        onViewDetails: () =>
          viewDetails(
            "Task Completion Details",
            `Completion Rate: ${cardData.taskCompletion}%\nTarget: 80%\n${
              cardData.taskCompletion >= 80
                ? "✅ On track to meet target"
                : "⚠️ Need to improve by " +
                  (80 - cardData.taskCompletion) +
                  "%"
            }`,
          ),
        onExport: () => exportData("completion"),
      },
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 1.5, md: 2 },
        bgcolor: "#f7f9fc",
        width: "100%",
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
        }}
      >
        SaaS Dashboard
      </Typography>

      {/* Row 1: 4 Cards */}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
        {cards.map(({ Component, props }, i) => (
          <Grid
            key={i}
            size={{ xs: 12, sm: 6, md: 6, lg: 3 }}
            sx={{ minWidth: 0 }}
          >
            <Component {...props} />
          </Grid>
        ))}
      </Grid>

      {/* Row 2: Table + Bar Chart */}
      <Grid container sx={{ pt: 2 }}>
        <Grid size={{ xs: 12, lg: 9 }} sx={{ minWidth: 0 }}>
          <DataGridDemo rows={tableRows} loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, md: 12, lg: 3 }} sx={{ minWidth: 0, pt: 10 }}>
          <Barchart dataset={weatherData} loading={loading} />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={{ xs: 1.5, sm: 2 }}
        sx={{ mt: { xs: 5, sm: 4, md: 3 } }}
      >
        <Grid
          size={{ xs: 12, md: 12, lg: 9 }}
          sx={{
            height: { xs: 350, sm: 400, md: 450, lg: 500 },
            minWidth: 0,
          }}
        >
          <Map />
        </Grid>
        <Grid size={{ xs: 12, md: 12, lg: 3 }} sx={{ minWidth: 0 }}>
          {/* Pie chart stacked above table */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <PieChartWithCenterLabel
              weeklySales={weeklySales}
              loading={loading}
            />
            <WeeklySellsTable weeklySales={weeklySales} loading={loading} />
          </Box>
        </Grid>
      </Grid>

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            mx: { xs: 1, sm: 2 },
            width: { xs: "calc(100% - 16px)", sm: "100%" },
          },
        }}
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ whiteSpace: "pre-line" }}>
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
