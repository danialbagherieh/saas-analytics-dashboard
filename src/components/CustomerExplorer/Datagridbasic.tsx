// src/components/CustomerExplorer/DatagridBasic.tsx
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Skeleton } from "@mui/material";
import { columns, type CustomerRow } from "./Columns.tsx";

interface DatagridBasicProps {
  rows?: CustomerRow[];
  loading?: boolean;
}

const defaultRows: CustomerRow[] = [
  {
    id: 1,
    customer: "John Carter",
    company: "Acme Corp",
    revenue: 24000,
    status: "Active",
    lastActive: "2 days ago",
    segment: "john",
    location: "us",
    age: 34,
  },
  {
    id: 2,
    customer: "Emily Stone",
    company: "Nova Labs",
    revenue: 12000,
    status: "At Risk",
    lastActive: "14 days ago",
    segment: "emily",
    location: "uk",
    age: 23,
  },
  {
    id: 3,
    customer: "Michael Brown",
    company: "Orbit Inc",
    revenue: 54000,
    status: "Active",
    lastActive: "1 day ago",
    segment: "michael",
    location: "ca",
    age: 26,
  },
  {
    id: 4,
    customer: "Sarah Lee",
    company: "Zenith Tech",
    revenue: 8000,
    status: "Churned",
    lastActive: "45 days ago",
    segment: "sarah",
    location: "de",
    age: 18,
  },
];

export default function DatagridBasic({
  rows,
  loading = false,
}: DatagridBasicProps) {
  const data = rows ?? defaultRows;

  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        sx={{
          width: "100%",
          height: { xs: 320, sm: 380, md: 420 }, // ✅ responsive in sx
          borderRadius: 2,
        }}
      />
    );
  }

  const gridWidth = 900;

  // 👇 Dynamic height: fits content, caps at 420 for scroll
  const ROW_HEIGHT = 52; // DataGrid row height (compact density)
  const HEADER_HEIGHT = 56; // Column headers
  const FOOTER_HEIGHT = 52; // Pagination row
  const BUFFER = 8; // Border + safety

  const rowsToShow = Math.min(data.length, 5); // max 5 per page
  const contentHeight =
    HEADER_HEIGHT + rowsToShow * ROW_HEIGHT + FOOTER_HEIGHT + BUFFER;

  const gridHeight = Math.min(contentHeight, 420); // cap at 420

  return (
    // 🔥 OUTER: fixed height, clips overflow — parent can NEVER be pushed wider
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        height: gridHeight, // 👈 now dynamic, no breakpoints needed
        overflow: "hidden",
        border: "1px solid rgba(224, 224, 224, 1)",
        borderRadius: 1,
        bgcolor: "background.paper",
      }}
    >
      {/* 🔥 MIDDLE: absolute — takes content out of parent sizing. Scrolls here. */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflowX: "scroll",
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
        {/* 🔥 INNER: fixed width — causes the scroll */}
        <Box sx={{ width: gridWidth, height: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            density="compact"
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            sx={{
              border: "none",
              width: gridWidth,
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
  );
}
