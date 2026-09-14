// src/components/SettingAccess/Usermanagement.tsx
import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Switch,
  IconButton,
  Chip,
  Stack,
  Skeleton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

/* ---------- TYPES ---------- */
export type Role = "Admin" | "Manager" | "Analyst" | "Viewer";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}

export interface NewUser {
  name: string;
  email: string;
  role: Role | "";
}

const roleOptions: Role[] = ["Admin", "Manager", "Analyst", "Viewer"];

/* ---------- PROPS ---------- */
interface UserManagementProps {
  users?: User[];
  loading?: boolean;
  onAddUser?: (user: NewUser) => void;
  onDeleteUser?: (id: number) => void;
  onToggleActive?: (id: number) => void;
  onRoleChange?: (id: number, role: Role) => void;
}

/* ---------- DEFAULT DATA ---------- */
const defaultUsers: User[] = [
  {
    id: 1,
    name: "Emily Brown",
    email: "EmilyBrown@gmail.com",
    role: "Admin",
    active: true,
  },
  {
    id: 2,
    name: "Michael Johnson",
    email: "MichaelJohnson@gmail.com",
    role: "Analyst",
    active: true,
  },
  {
    id: 3,
    name: "Sarah Williams",
    email: "SarahWilliams@gmail.com",
    role: "Viewer",
    active: false,
  },
];

/* ---------- COMPONENT ---------- */
export default function UserManagement({
  users = defaultUsers,
  loading = false,
  onAddUser,
  onDeleteUser,
  onToggleActive,
  onRoleChange,
}: UserManagementProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    role: "",
  });

  /* ---------- HANDLERS ---------- */
  const handleAddUser = (): void => {
    if (!newUser.name || !newUser.email || !newUser.role) return;
    onAddUser?.(newUser);
    setNewUser({ name: "", email: "", role: "" });
    setOpen(false);
  };

  const handleRoleChange = (id: number, value: Role): void => {
    onRoleChange?.(id, value);
  };

  const handleToggleActive = (id: number): void => {
    onToggleActive?.(id);
  };

  const handleDelete = (id: number): void => {
    onDeleteUser?.(id);
  };

  const handleUserRoleChange =
    (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      handleRoleChange(id, event.target.value as Role);
    };

  const handleNewUserRoleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewUser({ ...newUser, role: event.target.value as Role });
  };

  // 👇 DYNAMIC HEIGHT CALCULATION (So the outer box has a fixed height)
  const ROW_HEIGHT = 60;
  const HEADER_HEIGHT = 56;
  const BUFFER = 8;
  const rowsToShow = Math.min(users.length, 5);
  const contentHeight = HEADER_HEIGHT + rowsToShow * ROW_HEIGHT + BUFFER;
  const tableHeight = Math.min(Math.max(contentHeight, 200), 500); // Max height 500px

  // 👇 Sum of column minWidths (Fixed width, cannot shrink)
  const tableMinWidth = 800;

  // 👇 Loading skeleton
  if (loading) {
    return (
      <Box sx={{ width: "100%", p: { xs: 1, sm: 2 } }}>
        <Stack direction="row" justifyContent="space-between" mb={3}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Stack>
        <Skeleton variant="rectangular" height={300} />
      </Box>
    );
  }

  /* ---------- UI ---------- */
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        p: { xs: 1, sm: 2 },
        boxSizing: "border-box",
      }}
    >
      {/* Add User Button */}
      <Stack
        direction="row"
        justifyContent="flex-end"
        mb={3}
        flexWrap="wrap"
        gap={0}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add User
        </Button>
      </Stack>

      {/* 🔥 OUTER: clips everything — parent never pushed wider (Fix #2 from image) */}
      <Box
        sx={{
          position: "relative", // Fix #1 from image (context for absolute)
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          height: tableHeight, // Fixed height required for absolute inner
          overflow: "hidden", // Fix #2 from image
          border: "1px solid rgba(224, 224, 224, 1)",
          borderRadius: 1,
          bgcolor: "background.paper",
        }}
      >
        {/* 🔥 MIDDLE: absolute positioning removes it from parent size calc (Fix #1 from image) */}
        <Box
          sx={{
            position: "absolute", // Fix #1 from image
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflowX: "auto", // Fix #3 from image (scrollbar is on IT)
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
          {/* 🔥 INNER: min-width forces horizontal scroll when narrow (Fix #4 from image) */}
          <Box
            sx={{
              minWidth: tableMinWidth, // Fix #4 from image (cannot shrink)
              width: "100%",
            }}
          >
            <Table
              sx={{
                minWidth: tableMinWidth,
                width: "100%",
                "& .MuiTableCell-root": {
                  whiteSpace: "nowrap",
                },
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "grey.100",
                    "& th": { fontWeight: 700, fontSize: 13 },
                  }}
                >
                  <TableCell sx={{ minWidth: 150 }}>Name</TableCell>
                  <TableCell sx={{ minWidth: 220 }}>Email</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>Role</TableCell>
                  <TableCell sx={{ minWidth: 180 }}>Status</TableCell>
                  <TableCell align="right" sx={{ minWidth: 90 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>

                    <TableCell>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        value={user.role}
                        onChange={handleUserRoleChange(user.id)}
                        sx={{ minWidth: 130 }}
                      >
                        {roleOptions.map((role) => (
                          <MenuItem key={role} value={role}>
                            {role}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={user.active ? "Active" : "Inactive"}
                          color={user.active ? "success" : "default"}
                          size="small"
                        />
                        <Switch
                          checked={user.active}
                          onChange={() => handleToggleActive(user.id)}
                        />
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Empty state */}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ py: 4, color: "text.secondary" }}
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Box>

      {/* Add User Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New User</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              value={newUser.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
              fullWidth
            />

            <TextField
              label="Email"
              value={newUser.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              fullWidth
            />

            <TextField
              select
              fullWidth
              label="Role"
              value={newUser.role}
              onChange={handleNewUserRoleChange}
            >
              {roleOptions.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddUser}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
