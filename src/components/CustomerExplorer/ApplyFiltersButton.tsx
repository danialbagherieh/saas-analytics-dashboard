// src/components/customerexplorer/Basicbutton.tsx
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FilterListIcon from "@mui/icons-material/FilterList";

// 👇 Define the props interface
interface BasicButtonProps {
  onClick: () => void;
}

export default function BasicButton({ onClick }: BasicButtonProps) {
  return (
    <Stack direction="row" mt={4} spacing={2}>
      <Button
        variant="contained"
        endIcon={<FilterListIcon />}
        onClick={onClick}
      >
        Apply Filters
      </Button>
    </Stack>
  );
}
