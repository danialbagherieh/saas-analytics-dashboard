// src/components/Dashboard/DataGridDemo/DataGridDemo.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { SxProps, Theme } from "@mui/material/styles";

export interface CustomerData {
  name: string;
  plan: string;
  activeUsers: number;
  revenue: number;
  conversion: number;
}

interface DataGridDemoProps {
  rows?: CustomerData[];
  loading?: boolean;
  sx?: SxProps<Theme>;
}

const defaultRows: CustomerData[] = [
  {
    name: "Acme Corp",
    plan: "Pro",
    activeUsers: 1200,
    revenue: 50000,
    conversion: 30,
  },
  {
    name: "Delta Co",
    plan: "Pro",
    activeUsers: 800,
    revenue: 32000,
    conversion: 20,
  },
  {
    name: "Eta Solutions",
    plan: "Pro",
    activeUsers: 600,
    revenue: 24000,
    conversion: 15,
  },
  {
    name: "Iota Systems",
    plan: "Pro",
    activeUsers: 950,
    revenue: 38000,
    conversion: 23.75,
  },
  {
    name: "Gamma Inc",
    plan: "Enterprise",
    activeUsers: 5000,
    revenue: 250000,
    conversion: 125,
  },
  {
    name: "Zeta Tech",
    plan: "Enterprise",
    activeUsers: 4200,
    revenue: 200000,
    conversion: 105,
  },
  {
    name: "Kappa Networks",
    plan: "Enterprise",
    activeUsers: 3500,
    revenue: 180000,
    conversion: 87.5,
  },
  {
    name: "Beta LLC",
    plan: "Basic",
    activeUsers: 300,
    revenue: 8000,
    conversion: 7.5,
  },
  {
    name: "Epsilon Ltd",
    plan: "Basic",
    activeUsers: 150,
    revenue: 5000,
    conversion: 3.75,
  },
  {
    name: "Theta Labs",
    plan: "Basic",
    activeUsers: 220,
    revenue: 7000,
    conversion: 5.5,
  },
];

export default function DataGridDemo({
  rows: propRows,
  loading = false,
  sx,
}: DataGridDemoProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchText, setSearchText] = React.useState("");
  const [planFilter, setPlanFilter] = React.useState<string>("All");

  const sourceRows = propRows ?? defaultRows;

  const filteredRows = React.useMemo(() => {
    return sourceRows
      .filter((row) => {
        const matchesSearch = row.name
          .toLowerCase()
          .includes(searchText.toLowerCase());
        const matchesPlan = planFilter === "All" || row.plan === planFilter;
        return matchesSearch && matchesPlan;
      })
      .map((row, idx) => ({ id: idx, ...row }));
  }, [sourceRows, searchText, planFilter]);

  // 🔑 KEY CHANGE: use `flex` instead of fixed `width`
  // Columns will GROW to fill screen when wide, SHRINK until minWidth when narrow
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Customer",
      flex: 1.2,
      minWidth: 160,
      sortable: true,
    },
    {
      field: "plan",
      headerName: "Plan",
      flex: 0.8,
      minWidth: 120,
      sortable: true,
      renderCell: (params) => {
        let color: "default" | "primary" | "success" | "warning" = "default";
        if (params.value === "Basic") color = "warning";
        else if (params.value === "Pro") color = "primary";
        else if (params.value === "Enterprise") color = "success";
        return <Chip label={params.value} color={color} size="small" />;
      },
    },
    {
      field: "activeUsers",
      headerName: "Active Users",
      flex: 1,
      minWidth: 140,
      align: "right",
      headerAlign: "right",
      sortable: true,
      renderCell: (params) => (
        <Typography variant="body2">
          {(params.value as number).toLocaleString()}
        </Typography>
      ),
    },
    {
      field: "revenue",
      headerName: "Revenue ($)",
      flex: 1,
      minWidth: 150,
      align: "right",
      headerAlign: "right",
      sortable: true,
      renderCell: (params) => {
        const value = params.value as number;
        let color: "success" | "warning" | "error" = "success";
        if (value < 20000) color = "error";
        else if (value < 50000) color = "warning";
        return (
          <Chip
            label={`$${value.toLocaleString()}`}
            color={color}
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        );
      },
    },
    {
      field: "conversion",
      headerName: "Conversion Rate (%)",
      flex: 1.2,
      minWidth: 170,
      align: "right",
      headerAlign: "right",
      sortable: true,
      renderCell: (params) => {
        const value = params.value as number;
        let color = "green";
        if (value < 1.5) color = "red";
        else if (value < 2.5) color = "orange";
        return (
          <Typography sx={{ color, fontWeight: "bold" }}>
            {value.toFixed(2)}%
          </Typography>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        height={520}
        sx={{ borderRadius: 2, ...sx }}
      />
    );
  }

  const gridHeight = isMobile ? 420 : 480;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        ...sx,
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
          mb: 2,
        }}
      >
        <TextField
          label="Search Customer"
          size="small"
          value={searchText}
          onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchText(e.target.value)}
          sx={{ width: { xs: "100%", sm: 280 } }}
        />
        <TextField
          select
          label="Filter Plan"
          size="small"
          value={planFilter}
          onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPlanFilter(e.target.value)}
          sx={{ width: { xs: "100%", sm: 180 } }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Basic">Basic</MenuItem>
          <MenuItem value="Pro">Pro</MenuItem>
          <MenuItem value="Enterprise">Enterprise</MenuItem>
        </TextField>
      </Box>

      {/* 🔥 FIXED: outer clipped, inner absolute-scrolling, DataGrid fills 100% */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          height: gridHeight,
          overflow: "hidden",
          border: "1px solid rgba(224, 224, 224, 1)",
          borderRadius: 1,
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflowX: "auto", // 👈 auto (show only when needed)
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": { height: 10 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0, 0, 0, 0.35)",
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          {/* 🔑 minWidth = sum of all column minWidths (160+120+140+150+170 = 740 → use 760) */}
          <Box
            sx={{
              minWidth: 760, // 👈 triggers scroll when container < 760
              width: "100%", // 👈 FILLS container when wider
              height: "100%",
            }}
          >
            <DataGrid
              rows={filteredRows}
              columns={columns}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              density={isMobile ? "compact" : "standard"}
              sx={{
                border: "none",
                width: "100%", // 👈 FILLS the inner box
                minWidth: 760, // 👈 never shrink below 760
                height: "100%",
                bgcolor: "background.paper",
                "& .MuiDataGrid-cell": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiDataGrid-columnHeaders": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  fontWeight: 600,
                  bgcolor: "background.paper",
                },
                "& .MuiDataGrid-row:nth-of-type(odd)": {
                  bgcolor: "rgba(0, 0, 0, 0.02)",
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
