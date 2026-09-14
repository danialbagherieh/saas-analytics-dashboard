// src/components/customerexplorer/FilterSelects.tsx
import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, MenuItem, Grid } from "@mui/material";

// Define the filter configuration with an added 'All' option
const filterConfigs = [
  {
    id: "segment",
    label: "Segment",
    options: [
      { value: "", label: "All Segments" }, // 👈 Added 'All' option
      { value: "john", label: "John Carter" },
      { value: "emily", label: "Emily Nova Labs" },
      { value: "michael", label: "Michael Brown" },
      { value: "sarah", label: "Sarah Lee" },
    ],
  },
  {
    id: "location",
    label: "Location",
    options: [
      { value: "", label: "All Locations" }, // 👈 Added 'All' option
      { value: "us", label: "United States" },
      { value: "uk", label: "London" },
      { value: "ca", label: "Canada" },
      { value: "de", label: "Germany" },
    ],
  },
  {
    id: "age",
    label: "Age Range",
    options: [
      { value: "", label: "All Ages" }, // 👈 Added 'All' option
      { value: "18", label: "18" },
      { value: "23", label: "23" },
      { value: "26", label: "26" },
      { value: "34", label: "34" },
    ],
  },
];

// 👇 Define props interface for the component
interface FilterSelectsProps {
  onFilterChange: (id: string, value: string) => void;
  initialValues?: Record<string, string>;
}

export default function FilterSelects({
  onFilterChange,
  initialValues = { segment: "", location: "", age: "" },
}: FilterSelectsProps) {
  // 👇 Store all filter values in one object
  const [values, setValues] = useState<Record<string, string>>(initialValues);

  // 👇 Update internal state when initialValues change from parent
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange =
    (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setValues((prev) => ({ ...prev, [id]: newValue }));
      // 👇 Notify parent component about the change
      onFilterChange(id, newValue);
    };

  const getLabel = (id: string) => {
    switch (id) {
      case "segment":
        return "Segment";
      case "location":
        return "Location";
      case "age":
        return "Age Range";
      default:
        return "";
    }
  };

  return (
    <Grid container spacing={3}>
      {filterConfigs.map((filter) => (
        <Grid key={filter.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {getLabel(filter.id)}
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              label={filter.label}
              value={values[filter.id] || ""}
              onChange={handleChange(filter.id)}
            >
              {filter.options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
