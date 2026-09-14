// src/pages/Dataintegrations.tsx
import { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";

import IntegrationStatsCards from "../components/DataIntegrations/IntegrationCards";
import Datagridintegration from "../components/DataIntegrations/Datagridintegration";
import Basicbuttongroup, {
  type IntegrationFilter,
} from "../components/DataIntegrations/basicbuttongroup";
import type { IntegrationRow } from "../components/DataIntegrations/Datagridintegration";

// Full dataset (mock data)
const defaultAllRows: IntegrationRow[] = [
  {
    id: 1,
    name: "Salesforce",
    type: "CRM",
    status: "Connected",
    lastSync: "5 min ago",
  },
  {
    id: 2,
    name: "Google Analytics",
    type: "Analytics",
    status: "Connected",
    lastSync: "10 min ago",
  },
  {
    id: 3,
    name: "MySQL Database",
    type: "Database",
    status: "Failed",
    lastSync: "1 hour ago",
  },
  {
    id: 4,
    name: "HubSpot",
    type: "CRM",
    status: "Connected",
    lastSync: "15 min ago",
  },
  {
    id: 5,
    name: "Stripe",
    type: "Payment",
    status: "Failed",
    lastSync: "2 hours ago",
  },
  {
    id: 6,
    name: "Slack",
    type: "Communication",
    status: "Connected",
    lastSync: "1 min ago",
  },
];

export default function Dataintegrations() {
  const [allRows, setAllRows] = useState<IntegrationRow[]>(defaultAllRows);
  const [filter, setFilter] = useState<IntegrationFilter>("all");
  const [loading, setLoading] = useState(false);

  // Simulate API loading
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAllRows(defaultAllRows);
      setLoading(false);
    }, 500);
  }, []);

  // Filter rows
  const filteredRows = allRows.filter((row) => {
    if (filter === "all") return true;
    if (filter === "active") return row.status === "Connected";
    if (filter === "failed") return row.status === "Failed";
    return true;
  });

  // Stats
  const stats = {
    total: filteredRows.length,
    active: filteredRows.filter((row) => row.status === "Connected").length,
    failed: filteredRows.filter((row) => row.status === "Failed").length,
  };

  const handleFilterChange = (newFilter: IntegrationFilter) => {
    setFilter(newFilter);
  };

  const handleDeleteRow = (id: number) => {
    setAllRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleRefreshRow = (id: number) => {
    setAllRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              lastSync: "just now",
              status: "Connected" as const, // refresh = successful sync
            }
          : row,
      ),
    );
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 1.5, md: 2 },
        bgcolor: "#f7f9fc",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflowX: "hidden", // 👈 page never scrolls horizontally
        boxSizing: "border-box",
        minHeight: "100vh",
      }}
    >
      {/* Filter buttons */}
      <Grid container spacing={2}>
        <Grid
          size={{ xs: 12 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            minWidth: 0,
            maxWidth: "100%",
          }}
        >
          <Basicbuttongroup
            filter={filter}
            onFilterChange={handleFilterChange}
          />
        </Grid>
      </Grid>

      {/* Stats cards */}
      <Grid container spacing={2} sx={{ mt: { xs: 2, sm: 3 } }}>
        <Grid size={{ xs: 12 }} sx={{ minWidth: 0, maxWidth: "100%" }}>
          <IntegrationStatsCards
            total={stats.total}
            active={stats.active}
            failed={stats.failed}
          />
        </Grid>
      </Grid>

      {/* Data grid */}
      <Grid container spacing={2} sx={{ mt: { xs: 2, sm: 3 } }}>
        <Grid
          size={{ xs: 12 }}
          sx={{ minWidth: 0, maxWidth: "100%", overflow: "hidden" }}
        >
          <Datagridintegration
            rows={filteredRows}
            loading={loading}
            onDelete={handleDeleteRow}
            onRefresh={handleRefreshRow}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
