// src/components/customerexplorer/Columns.tsx
import Chip from "@mui/material/Chip";
import type { GridColDef } from "@mui/x-data-grid";

export type CustomerRow = {
  id: number;
  customer: string;
  company: string;
  revenue: number;
  status: "Active" | "At Risk" | "Churned";
  lastActive: string;
  // 👇 New fields for filtering
  segment: string; // e.g. "john", "emily"
  location: string; // "us", "uk", "ca", "de"
  age: number; // numeric age
};

export const columns: GridColDef<CustomerRow>[] = [
  {
    field: "customer",
    headerName: "Customer",
    flex: 1.2,
    minWidth: 140,
  },
  {
    field: "company",
    headerName: "Company",
    flex: 1.2,
    minWidth: 140,
  },
  {
    field: "revenue",
    headerName: "Revenue ($)",
    type: "number",
    flex: 1,
    minWidth: 120,
    valueFormatter: (value: number | undefined) =>
      value ? `$${value.toLocaleString()}` : "$0",
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 120,
    renderCell: (params) => {
      const status = params.value as string | undefined;
      let color: "success" | "warning" | "error" | "default" = "default";
      if (status === "Active") color = "success";
      else if (status === "At Risk") color = "warning";
      else if (status === "Churned") color = "error";
      else color = "default";
      return <Chip label={status || "Unknown"} color={color} size="small" />;
    },
  },
  {
    field: "lastActive",
    headerName: "Last Active",
    flex: 1,
    minWidth: 120,
  },
];
