// src/components/DataIntegrations/Datagridintegration.tsx
import { useState } from "react";
import {
  Box,
  Chip,
  IconButton,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// 👇 Row type
export type IntegrationRow = {
  id: number;
  name: string;
  type: string;
  status: "Connected" | "Failed";
  lastSync: string;
};

interface DatagridintegrationProps {
  rows?: IntegrationRow[];
  loading?: boolean;
  onDelete?: (id: number) => void;
  onRefresh?: (id: number) => void; // 👈 NEW
}

const defaultRows: IntegrationRow[] = [
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
];

export default function Datagridintegration({
  rows,
  loading = false,
  onDelete,
  onRefresh,
}: DatagridintegrationProps) {
  const data = rows ?? defaultRows;

  // Delete confirmation dialog
  const [confirmRow, setConfirmRow] = useState<IntegrationRow | null>(null);

  // 👇 NEW: track which row is currently refreshing
  const [refreshingId, setRefreshingId] = useState<number | null>(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "success" });

  // ------- DELETE HANDLERS -------
  const handleDeleteClick = (row: IntegrationRow) => {
    setConfirmRow(row);
  };

  const handleConfirmDelete = () => {
    if (!confirmRow) return;
    const deletedName = confirmRow.name;
    onDelete?.(confirmRow.id);
    setConfirmRow(null);
    setSnackbar({
      open: true,
      message: `🗑️ "${deletedName}" removed successfully`,
      severity: "success",
    });
  };

  const handleCancelDelete = () => {
    setConfirmRow(null);
  };

  // ------- REFRESH HANDLER -------
  const handleRefreshClick = (row: IntegrationRow) => {
    setRefreshingId(row.id);

    // 👇 Simulate API call (1s delay)
    setTimeout(() => {
      onRefresh?.(row.id);
      setRefreshingId(null);
      setSnackbar({
        open: true,
        message: `✅ "${row.name}" synced successfully`,
        severity: "success",
      });
    }, 1000);
  };

  // 👇 Dynamic height
  const ROW_HEIGHT = 44;
  const HEADER_HEIGHT = 44;
  const FOOTER_HEIGHT = 52;
  const BUFFER = 8;

  const rowsToShow = Math.min(data.length, 5);
  const contentHeight =
    HEADER_HEIGHT + rowsToShow * ROW_HEIGHT + FOOTER_HEIGHT + BUFFER;
  const gridHeight = Math.min(Math.max(contentHeight, 180), 420);

  const gridWidth = 900;

  // 👇 Columns (inside component for handler access)
  const columns: GridColDef<IntegrationRow>[] = [
    {
      field: "name",
      headerName: "Integration",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Connected" ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "lastSync",
      headerName: "Last Sync",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 120,
      renderCell: (params) => {
        const isRefreshing = refreshingId === params.row.id;
        return (
          <>
            {/* 🔄 Refresh button */}
            <IconButton
              size="small"
              title="Refresh"
              disabled={isRefreshing}
              onClick={() => handleRefreshClick(params.row)}
            >
              {isRefreshing ? (
                <CircularProgress size={18} thickness={5} />
              ) : (
                <RefreshIcon fontSize="small" />
              )}
            </IconButton>

            {/* 🗑️ Delete button */}
            <IconButton
              size="small"
              color="error"
              title="Delete"
              disabled={isRefreshing}
              onClick={() => handleDeleteClick(params.row)}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        sx={{ width: "100%", height: gridHeight, borderRadius: 2 }}
      />
    );
  }

  return (
    <>
      {/* DataGrid wrapper */}
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
            overflowX: "auto",
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
          <Box sx={{ minWidth: gridWidth, width: "100%", height: "100%" }}>
            <DataGrid
              rows={data}
              columns={columns}
              pageSizeOptions={[5]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5, page: 0 },
                },
              }}
              disableRowSelectionOnClick
              rowHeight={ROW_HEIGHT}
              columnHeaderHeight={HEADER_HEIGHT}
              sx={{
                border: "none",
                minWidth: gridWidth,
                width: "100%",
                height: "100%",
                bgcolor: "background.paper",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "background.paper",
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
                "& .MuiDataGrid-cell": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* 🗑️ Delete confirmation dialog */}
      <Dialog
        open={!!confirmRow}
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Integration</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{confirmRow?.name}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Feedback snackbar */}
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
    </>
  );
}
