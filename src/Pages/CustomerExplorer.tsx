// src/pages/CustomerExplorer.tsx
import { useState, useMemo } from "react";
import { Box, Grid } from "@mui/material";

import FilterSelects from "../components/CustomerExplorer/FilterSelects";
import BasicButton from "../components/CustomerExplorer/ApplyFiltersButton";
import Area from "../components/CustomerExplorer/Area";
import DatagridBasic from "../components/CustomerExplorer/Datagridbasic";
import type { CustomerRow } from "../components/CustomerExplorer/Columns";

// 👇 Full master data – you could fetch from an API later
const allCustomers: CustomerRow[] = [
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

export default function CustomerExplorer() {
  const [filters, setFilters] = useState({
    segment: "",
    location: "",
    age: "",
  });

  // 👇 Derived filtered rows using useMemo for performance
  const filteredRows = useMemo(() => {
    return allCustomers.filter((row) => {
      const segmentMatch = !filters.segment || row.segment === filters.segment;
      const locationMatch =
        !filters.location || row.location === filters.location;
      const ageMatch = !filters.age || row.age === parseInt(filters.age, 10);
      return segmentMatch && locationMatch && ageMatch;
    });
  }, [filters]);

  const handleFilterChange = (id: string, value: string) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const handleApplyFilters = () => {
    console.log("Applying filters:", filters);
  };

  return (
    <Box sx={{ p: 2, bgcolor: "#f7f9fc", width: "100%", overflowX: "hidden" }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 9 }}>
          <FilterSelects
            onFilterChange={handleFilterChange}
            initialValues={filters}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <BasicButton onClick={handleApplyFilters} />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Area />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DatagridBasic rows={filteredRows} />
        </Grid>
      </Grid>
    </Box>
  );
}
