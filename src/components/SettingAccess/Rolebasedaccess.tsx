// src/components/SettingAccess/Rolebasedaccess.tsx
import React, { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRowParams } from "@mui/x-data-grid";
import {
  Skeleton,
  TextField,
  Stack,
  Button,
  Chip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import GetAppIcon from "@mui/icons-material/GetApp";

// 👇 Role row type
export interface RoleRow {
  id: number;
  roleName: "Admin" | "Manager" | "Analyst" | "Viewer";
  description: string;
  permissionsCount: number;
  usersCount: number;
  status: "Active" | "Inactive";
}

interface RolebasedaccessProps {
  rows?: RoleRow[];
  loading?: boolean;
  onRowClick?: (row: RoleRow) => void;
}

const defaultRows: RoleRow[] = [
  {
    id: 1,
    roleName: "Admin",
    description: "Full system access — manage users, billing, settings",
    permissionsCount: 12,
    usersCount: 1,
    status: "Active",
  },
  {
    id: 2,
    roleName: "Manager",
    description: "Manage users and reports, cannot change billing",
    permissionsCount: 8,
    usersCount: 1,
    status: "Active",
  },
  {
    id: 3,
    roleName: "Analyst",
    description: "View and export reports, cannot modify data",
    permissionsCount: 4,
    usersCount: 1,
    status: "Active",
  },
  {
    id: 4,
    roleName: "Viewer",
    description: "Read-only access to dashboards",
    permissionsCount: 2,
    usersCount: 2,
    status: "Active",
  },
];

// 👇 Columns
const columns: GridColDef<RoleRow>[] = [
  {
    field: "roleName",
    headerName: "Role",
    width: 140,
    renderCell: (params) => {
      const role = params.value as RoleRow["roleName"];
      let color: "error" | "warning" | "primary" | "success" = "primary";
      if (role === "Admin") color = "error";
      else if (role === "Manager") color = "warning";
      else if (role === "Analyst") color = "primary";
      else if (role === "Viewer") color = "success";
      return <Chip label={role} color={color} size="small" />;
    },
  },
  {
    field: "description",
    headerName: "Description",
    flex: 2,
    minWidth: 280,
  },
  {
    field: "permissionsCount",
    headerName: "Permissions",
    type: "number",
    width: 130,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: "usersCount",
    headerName: "Users",
    type: "number",
    width: 100,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const count = params.value as number;
      let color: "default" | "primary" = "default";
      if (count > 0) color = "primary";
      return (
        <Chip
          label={count}
          color={color}
          size="small"
          sx={{ fontWeight: 700, minWidth: 40 }}
        />
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={params.value === "Active" ? "success" : "default"}
        size="small"
      />
    ),
  },
];

export default function Rolebasedaccess({
  rows = defaultRows,
  loading = false,
  onRowClick,
}: RolebasedaccessProps) {
  const [searchText, setSearchText] = useState("");

  const filteredRows = useMemo(() => {
    if (!searchText.trim()) return rows;
    const search = searchText.toLowerCase();
    return rows.filter(
      (row) =>
        row.roleName.toLowerCase().includes(search) ||
        row.description.toLowerCase().includes(search) ||
        row.status.toLowerCase().includes(search),
    );
  }, [rows, searchText]);

  const handleExport = () => {
    const headers = [
      "ID",
      "Role",
      "Description",
      "Permissions",
      "Users",
      "Status",
    ];
    const csvRows = filteredRows.map((row) =>
      [
        row.id,
        row.roleName,
        `"${row.description}"`,
        row.permissionsCount,
        row.usersCount,
        row.status,
      ].join(","),
    );
    const csv = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "role_access_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearSearch = () => setSearchText("");

  const ROW_HEIGHT = 56;
  const HEADER_HEIGHT = 56;
  const FOOTER_HEIGHT = 52;
  const BUFFER = 8;

  const rowsToShow = Math.min(filteredRows.length, 5);
  const contentHeight =
    HEADER_HEIGHT + rowsToShow * ROW_HEIGHT + FOOTER_HEIGHT + BUFFER;
  const gridHeight = Math.min(Math.max(contentHeight, 180), 420);

  const gridMinWidth = 750;

  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        sx={{ width: "100%", height: gridHeight, borderRadius: 2 }}
      />
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      {/* Toolbar */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2 }}
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{ mb: 2, flexWrap: "wrap", gap: 1, width: "100%" }}
      >
        <TextField
          size="small"
          placeholder="Search roles..."
          value={searchText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchText(e.target.value)
          }
          InputProps={{
            startAdornment: (
              <SearchIcon
                fontSize="small"
                sx={{ mr: 1, color: "text.secondary" }}
              />
            ),
            endAdornment: searchText && (
              <ClearIcon
                fontSize="small"
                sx={{ cursor: "pointer", color: "text.secondary" }}
                onClick={handleClearSearch}
              />
            ),
          }}
          sx={{
            width: { xs: "100%", sm: 280 },
            minWidth: { xs: "100%", sm: 200 },
          }}
        />
        <Button
          size="small"
          variant="outlined"
          startIcon={<GetAppIcon />}
          onClick={handleExport}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Export CSV
        </Button>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            ml: { xs: 0, sm: "auto" },
            textAlign: { xs: "right", sm: "left" },
            flexShrink: 0,
          }}
        >
          {filteredRows.length} {filteredRows.length === 1 ? "role" : "roles"}
        </Typography>
      </Stack>

      {/* OUTER */}
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
        {/* MIDDLE — scroll */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflowX: "auto",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": { height: 10, width: 10 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0, 0, 0, 0.35)",
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          <Box
            sx={{
              minWidth: gridMinWidth,
              width: "100%",
              height: "100%",
            }}
          >
            <DataGrid
              rows={filteredRows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 },
                },
                sorting: {
                  sortModel: [{ field: "id", sort: "asc" }],
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              // 👇 REMOVED: checkboxSelection
              // 👇 REMOVED: disableRowSelectionOnClick
              onRowClick={(params: GridRowParams<RoleRow>) => {
                onRowClick?.(params.row);
              }}
              sx={{
                border: "none",
                minWidth: gridMinWidth,
                width: "100%",
                height: "100%",
                bgcolor: "background.paper",

                // Hide DataGrid's internal scrollbars
                "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                  display: "none",
                  height: 0,
                  width: 0,
                },
                "& .MuiDataGrid-virtualScroller": {
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                },
                "& .MuiDataGrid-scrollbar--horizontal": { display: "none" },
                "& .MuiDataGrid-scrollbar--vertical": { display: "none" },
                "& .MuiDataGrid-scrollbar": { display: "none" },
                "& .MuiDataGrid-scrollbarFiller": { display: "none" },

                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "background.paper",
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
                "& .MuiDataGrid-cell": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
                "& .MuiDataGrid-row:hover": {
                  cursor: "pointer",
                  backgroundColor: "action.hover",
                },
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
