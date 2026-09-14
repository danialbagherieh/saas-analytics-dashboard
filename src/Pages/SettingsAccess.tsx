// src/pages/SettingsAccess.tsx
import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  Snackbar,
  Alert,
  Typography,
  Divider,
  Chip,
} from "@mui/material";

import Rolebasedaccess, {
  type RoleRow,
} from "../components/SettingAccess/Rolebasedaccess";
import Usermanagement, {
  type User,
  type NewUser,
  type Role,
} from "../components/SettingAccess/Usermanagement";

// 👇 Static role metadata (permissions, description)
const roleMetadata: Record<
  Role,
  { description: string; permissionsCount: number }
> = {
  Admin: {
    description: "Full system access — manage users, billing, settings",
    permissionsCount: 12,
  },
  Manager: {
    description: "Manage users and reports, cannot change billing",
    permissionsCount: 8,
  },
  Analyst: {
    description: "View and export reports, cannot modify data",
    permissionsCount: 4,
  },
  Viewer: {
    description: "Read-only access to dashboards",
    permissionsCount: 2,
  },
};

// 👇 Default users
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
  {
    id: 4,
    name: "James Davis",
    email: "JamesDavis@gmail.com",
    role: "Manager",
    active: true,
  },
  {
    id: 5,
    name: "Jessica Miller",
    email: "JessicaMiller@gmail.com",
    role: "Viewer",
    active: false,
  },
];

export default function SettingsAccess() {
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // 👇 Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUsers(defaultUsers);
      setLoading(false);
    }, 800);
  }, []);

  // 👇 AUTO-COMPUTED role rows from users
  const roleRows: RoleRow[] = useMemo(() => {
    const roles: Role[] = ["Admin", "Manager", "Analyst", "Viewer"];
    return roles.map((role, index) => ({
      id: index + 1,
      roleName: role,
      description: roleMetadata[role].description,
      permissionsCount: roleMetadata[role].permissionsCount,
      usersCount: users.filter((u) => u.role === role).length,
      status: "Active",
    }));
  }, [users]);

  // 👇 Handle role row click
  const handleRowClick = (row: RoleRow) => {
    setSelectedRole(row.roleName);
    const usersInRole = users.filter((u) => u.role === row.roleName);

    if (usersInRole.length === 0) {
      setSnackbar({
        open: true,
        message: `No users assigned to "${row.roleName}" role`,
        severity: "warning",
      });
    } else {
      setSnackbar({
        open: true,
        message: `"${row.roleName}" role: ${usersInRole.length} user(s) — ${usersInRole.map((u) => u.name).join(", ")}`,
        severity: "info",
      });
    }
  };

  const handleClearSelected = () => setSelectedRole(null);

  // 👇 User handlers (unchanged)
  const handleAddUser = (newUser: NewUser) => {
    if (!newUser.name || !newUser.email || !newUser.role) return;
    const user: User = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as Role,
      active: true,
    };
    setUsers((prev) => [...prev, user]);
    setSnackbar({
      open: true,
      message: `✅ User "${user.name}" added as ${user.role} — ${user.role} role now has ${users.filter((u) => u.role === user.role).length + 1} user(s)`,
      severity: "success",
    });
  };

  const handleDeleteUser = (id: number) => {
    const user = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setSnackbar({
      open: true,
      message: `🗑️ User "${user?.name || id}" deleted!`,
      severity: "warning",
    });
  };

  const handleToggleActive = (id: number) => {
    const user = users.find((u) => u.id === id);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u)),
    );
    setSnackbar({
      open: true,
      message: `🔄 User "${user?.name || id}" toggled to ${!user?.active ? "Active" : "Inactive"}!`,
      severity: "info",
    });
  };

  const handleRoleChange = (id: number, role: Role) => {
    const user = users.find((u) => u.id === id);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    setSnackbar({
      open: true,
      message: `🔑 User "${user?.name || id}" role changed to "${role}" — Role counts updated!`,
      severity: "success",
    });
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 1.5, md: 2 },
        bgcolor: "#f7f9fc",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflowX: "hidden",
        boxSizing: "border-box",
        minHeight: "100vh",
      }}
    >
      {/* Page Title + Selected Role Chip */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 1,
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" } }}
        >
          Settings & Access Control
        </Typography>
        {selectedRole && (
          <Chip
            label={`Selected Role: ${selectedRole}`}
            color="primary"
            onDelete={handleClearSelected}
            sx={{ fontWeight: 500 }}
          />
        )}
      </Box>

      {/* Section 1: Role-Based Access Control */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Role-Based Access Control
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }} sx={{ minWidth: 0 }}>
          <Rolebasedaccess
            rows={roleRows}
            loading={loading}
            onRowClick={handleRowClick}
          />
        </Grid>
      </Grid>

      {/* Divider */}
      <Box sx={{ my: 2 }}>
        <Divider />
      </Box>

      {/* Section 2: User Management */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 0 }}>
        User Management
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }} sx={{ minWidth: 0 }}>
          <Usermanagement
            users={users}
            loading={loading}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            onToggleActive={handleToggleActive}
            onRoleChange={handleRoleChange}
          />
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
    </Box>
  );
}
