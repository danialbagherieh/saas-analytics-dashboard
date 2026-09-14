import { Button, ButtonGroup } from "@mui/material";

// 👇 Export the filter type so parent can use it
export type IntegrationFilter = "all" | "active" | "failed";

// 👇 Props interface
interface IntegrationFilterButtonsProps {
  filter: IntegrationFilter;
  onFilterChange: (filter: IntegrationFilter) => void;
}

export default function IntegrationFilterButtons({
  filter,
  onFilterChange,
}: IntegrationFilterButtonsProps) {
  return (
    <ButtonGroup
      variant="outlined"
      aria-label="integration filter"
      size="small"
    >
      <Button
        variant={filter === "all" ? "contained" : "outlined"}
        onClick={() => onFilterChange("all")}
      >
        All
      </Button>

      <Button
        variant={filter === "active" ? "contained" : "outlined"}
        color="success"
        onClick={() => onFilterChange("active")}
      >
        Active
      </Button>

      <Button
        variant={filter === "failed" ? "contained" : "outlined"}
        color="error"
        onClick={() => onFilterChange("failed")}
      >
        Failed
      </Button>
    </ButtonGroup>
  );
}
