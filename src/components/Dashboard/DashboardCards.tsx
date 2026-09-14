// src/components/pagedashboard/DashboardCards.tsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GetAppIcon from "@mui/icons-material/GetApp";

const DashboardCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(2),
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  transition: "all 0.25s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
  },
}));

// 👇 Responsive icon wrapper
const IconWrapper = styled(Box)<{ bgcolor: string }>(({ bgcolor, theme }) => ({
  width: 40,
  height: 40,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: bgcolor,
  [theme.breakpoints.down("sm")]: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
}));

// 👇 Props interfaces with all callbacks
interface RevenueCardProps {
  revenue?: number;
  growth?: string;
  onRefresh?: () => void;
  onViewDetails?: () => void;
  onExport?: () => void;
}

interface ActiveUsersCardProps {
  users?: number;
  growth?: string;
  onRefresh?: () => void;
  onViewDetails?: () => void;
  onExport?: () => void;
}

interface ServerUptimeCardProps {
  uptime?: string;
  status?: string;
  onRefresh?: () => void;
  onViewDetails?: () => void;
  onExport?: () => void;
}

interface TaskCompletionCardProps {
  completion?: number;
  onRefresh?: () => void;
  onViewDetails?: () => void;
  onExport?: () => void;
}

const defaultData = {
  revenue: 42580,
  revenueGrowth: "+12.4%",
  users: 8930,
  usersGrowth: "+4.7%",
  uptime: "99.98%",
  uptimeStatus: "Stable",
  taskCompletion: 72,
};

// 👇 Shared card menu component
interface CardMenuProps {
  cardName: string;
  onRefresh?: () => void;
  onViewDetails?: () => void;
  onExport?: () => void;
}

function CardMenu({
  cardName,
  onRefresh,
  onViewDetails,
  onExport,
}: CardMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: () => void) => {
    action();
    handleClose();
  };

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleAction(() => onRefresh?.())}>
          <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
          Refresh {cardName}
        </MenuItem>
        <MenuItem onClick={() => handleAction(() => onViewDetails?.())}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleAction(() => onExport?.())}>
          <GetAppIcon fontSize="small" sx={{ mr: 1 }} />
          Export Data
        </MenuItem>
      </Menu>
    </>
  );
}

// 👇 Revenue Card
export const RevenueCard = ({
  revenue = defaultData.revenue,
  growth = defaultData.revenueGrowth,
  onRefresh,
  onViewDetails,
  onExport,
}: RevenueCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleRefresh = () => {
    setSnackbar({
      open: true,
      message: "✅ Revenue data refreshed successfully!",
      severity: "success",
    });
    onRefresh?.();
  };

  const handleViewDetails = () => {
    onViewDetails?.();
  };

  const handleExport = () => {
    setSnackbar({
      open: true,
      message: "📤 Revenue data exported successfully!",
      severity: "success",
    });
    onExport?.();
  };

  return (
    <>
      <DashboardCard
        sx={{
          background: "linear-gradient(145deg, #e3f2fd 0%, #ffffff 100%)",
        }}
      >
        <CardContent
          sx={{ p: isMobile ? 1 : 2, "&:last-child": { pb: isMobile ? 1 : 2 } }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconWrapper bgcolor="rgba(25, 118, 210, 0.15)">
              <TrendingUpIcon
                sx={{ color: "#1976d2", fontSize: isMobile ? 20 : 24 }}
              />
            </IconWrapper>
            <CardMenu
              cardName="Revenue"
              onRefresh={handleRefresh}
              onViewDetails={handleViewDetails}
              onExport={handleExport}
            />
          </Box>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
          >
            Monthly Revenue
          </Typography>
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ fontSize: isMobile ? "1.25rem" : "1.5rem" }}
          >
            ${revenue.toLocaleString()}
          </Typography>
          <Typography
            variant="body2"
            color="success.main"
            sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
          >
            {growth} this month
          </Typography>
        </CardContent>
      </DashboardCard>

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
};

// 👇 Active Users Card
export const ActiveUsersCard = ({
  users = defaultData.users,
  growth = defaultData.usersGrowth,
  onRefresh,
  onViewDetails,
  onExport,
}: ActiveUsersCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleRefresh = () => {
    setSnackbar({
      open: true,
      message: "✅ Active users data refreshed successfully!",
      severity: "success",
    });
    onRefresh?.();
  };

  const handleViewDetails = () => {
    onViewDetails?.();
  };

  const handleExport = () => {
    setSnackbar({
      open: true,
      message: "📤 Active users data exported successfully!",
      severity: "success",
    });
    onExport?.();
  };

  return (
    <>
      <DashboardCard
        sx={{
          background: "linear-gradient(145deg, #f3e5f5 0%, #ffffff 100%)",
        }}
      >
        <CardContent
          sx={{ p: isMobile ? 1 : 2, "&:last-child": { pb: isMobile ? 1 : 2 } }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconWrapper bgcolor="rgba(156, 39, 176, 0.15)">
              <PeopleAltIcon
                sx={{ color: "#9c27b0", fontSize: isMobile ? 20 : 24 }}
              />
            </IconWrapper>
            <CardMenu
              cardName="Active Users"
              onRefresh={handleRefresh}
              onViewDetails={handleViewDetails}
              onExport={handleExport}
            />
          </Box>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
          >
            Active Users
          </Typography>
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ fontSize: isMobile ? "1.25rem" : "1.5rem" }}
          >
            {users.toLocaleString()}
          </Typography>
          <Typography
            variant="body2"
            color="primary.main"
            sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
          >
            {growth} growth
          </Typography>
        </CardContent>
      </DashboardCard>

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
};

// 👇 Server Uptime Card
export const ServerUptimeCard = ({
  uptime = defaultData.uptime,
  status = defaultData.uptimeStatus,
  onRefresh,
  onViewDetails,
  onExport,
}: ServerUptimeCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleRefresh = () => {
    setSnackbar({
      open: true,
      message: "✅ Server uptime data refreshed successfully!",
      severity: "success",
    });
    onRefresh?.();
  };

  const handleViewDetails = () => {
    onViewDetails?.();
  };

  const handleExport = () => {
    setSnackbar({
      open: true,
      message: "📤 Server uptime data exported successfully!",
      severity: "success",
    });
    onExport?.();
  };

  return (
    <>
      <DashboardCard
        sx={{
          background: "linear-gradient(145deg, #e8f5e9 0%, #ffffff 100%)",
        }}
      >
        <CardContent
          sx={{ p: isMobile ? 1 : 2, "&:last-child": { pb: isMobile ? 1 : 2 } }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconWrapper bgcolor="rgba(76, 175, 80, 0.15)">
              <CloudQueueIcon
                sx={{ color: "#388e3c", fontSize: isMobile ? 20 : 24 }}
              />
            </IconWrapper>
            <CardMenu
              cardName="Server Uptime"
              onRefresh={handleRefresh}
              onViewDetails={handleViewDetails}
              onExport={handleExport}
            />
          </Box>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
          >
            Server Uptime
          </Typography>
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ fontSize: isMobile ? "1.25rem" : "1.5rem" }}
          >
            {uptime}
          </Typography>
          <Typography
            variant="body2"
            color="success.main"
            sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
          >
            {status}
          </Typography>
        </CardContent>
      </DashboardCard>

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
};

// 👇 Task Completion Card
export const TaskCompletionCard = ({
  completion = defaultData.taskCompletion,
  onRefresh,
  onViewDetails,
  onExport,
}: TaskCompletionCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleRefresh = () => {
    setSnackbar({
      open: true,
      message: "✅ Task completion data refreshed successfully!",
      severity: "success",
    });
    onRefresh?.();
  };

  const handleViewDetails = () => {
    onViewDetails?.();
  };

  const handleExport = () => {
    setSnackbar({
      open: true,
      message: "📤 Task completion data exported successfully!",
      severity: "success",
    });
    onExport?.();
  };

  return (
    <>
      <DashboardCard
        sx={{
          background: "linear-gradient(145deg, #fff8e1 0%, #ffffff 100%)",
        }}
      >
        <CardContent
          sx={{ p: isMobile ? 1 : 2, "&:last-child": { pb: isMobile ? 1 : 2 } }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconWrapper bgcolor="rgba(255, 193, 7, 0.15)">
              <TaskAltIcon
                sx={{ color: "#fbc02d", fontSize: isMobile ? 20 : 24 }}
              />
            </IconWrapper>
            <CardMenu
              cardName="Task Completion"
              onRefresh={handleRefresh}
              onViewDetails={handleViewDetails}
              onExport={handleExport}
            />
          </Box>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
          >
            Task Completion
          </Typography>
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ fontSize: isMobile ? "1.25rem" : "1.5rem" }}
          >
            {completion}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={completion}
            sx={{ mt: 1, height: 8, borderRadius: 5 }}
          />
        </CardContent>
      </DashboardCard>

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
};
