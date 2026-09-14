import { useState } from "react";
import type { FC } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { styled } from "@mui/material/styles";
import type { CSSObject, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import Divider from "@mui/material/Divider";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LockIcon from "@mui/icons-material/Lock";

import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ReportIcon from "@mui/icons-material/Report";
import CustomerExplorer from "./Pages/CustomerExplorer.tsx";
import ReportsInsights from "./Pages/ReportsInsights.tsx";
import Dashboard from "./Pages/Dashboard.tsx";
import DataIntegrations from "./Pages/DataIntegrations.tsx";
import SettingsAccess from "./Pages/SettingsAccess.tsx";
import Navbar from "./navbar.tsx";

import GroupIcon from "@mui/icons-material/Group";
import MobiledataOffIcon from "@mui/icons-material/MobiledataOff";

const COLLAPSED_WIDTH = 60;
const OPEN_WIDTH = 230;
const TRANSITION_MS = 200;
const TOOLBAR_HEIGHT = 0; // must match navbar.tsx

const openedMixin = (theme: Theme): CSSObject => ({
  width: OPEN_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: TRANSITION_MS,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  width: COLLAPSED_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: TRANSITION_MS,
  }),
  overflowX: "hidden",
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isMobile",
})<{ open?: boolean; isMobile?: boolean }>(({ theme, open, isMobile }) => ({
  width: isMobile ? 0 : OPEN_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  backgroundColor: "white",
  ...(open && !isMobile
    ? { ...openedMixin(theme) }
    : { ...closedMixin(theme) }),
  "& .MuiDrawer-paper":
    open && !isMobile ? openedMixin(theme) : closedMixin(theme),
}));

type MenuItemDef = {
  label: string;
  path: string;
  Icon:
    | typeof HomeIcon
    | typeof InfoIcon
    | typeof DashboardIcon
    | typeof ContactPhoneIcon
    | typeof ReportIcon;
  children?: { label: string; path: string }[];
};

const menuItems: MenuItemDef[] = [
  { label: "Dashboard", path: "/", Icon: DashboardIcon },
  { label: "Customer Explorer", path: "/customerexplorer", Icon: GroupIcon },
  {
    label: "Data & Integrations",
    path: "/dataintegrations",
    Icon: MobiledataOffIcon,
  },
  { label: "Reports & Insights", path: "/reportsinsights", Icon: ReportIcon },
  { label: "Settings & Access", path: "/settingsaccess", Icon: LockIcon },
];

const DrawerList: FC<{ open: boolean }> = ({ open }) => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {},
  );

  const handleDropdownToggle = (path: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const isPathActive = (
    itemPath: string,
    children?: { label: string; path: string }[],
  ) => {
    if (location.pathname === itemPath) return true;
    if (children) {
      return children.some((child) => location.pathname === child.path);
    }
    return false;
  };

  return (
    <List>
      {menuItems.map(({ label, path, Icon, children }) => {
        const selected = isPathActive(path, children);
        const isDropdownOpen = openDropdowns[path] || false;
        const hasChildren = children && children.length > 0;

        return (
          <div key={path}>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={
                  hasChildren ? () => handleDropdownToggle(path) : undefined
                }
                component={hasChildren ? "div" : Link}
                to={hasChildren ? undefined : path}
                selected={selected}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                aria-current={selected ? "page" : undefined}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  sx={{
                    opacity: open ? 1 : 0,
                    whiteSpace: "nowrap",
                  }}
                />
                {hasChildren && open && (
                  <Box sx={{ opacity: open ? 1 : 0 }}>
                    {isDropdownOpen ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                )}
              </ListItemButton>
            </ListItem>
            {hasChildren && (
              <Collapse
                in={isDropdownOpen && open}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {children.map((child) => {
                    const childSelected = location.pathname === child.path;
                    return (
                      <ListItemButton
                        key={child.path}
                        component={Link}
                        to={child.path}
                        selected={childSelected}
                        sx={{
                          minHeight: 48,
                          pl: open ? 4 : 2.5,
                          justifyContent: open ? "initial" : "center",
                        }}
                      >
                        <ListItemText
                          primary={child.label}
                          sx={{
                            opacity: open ? 1 : 0,
                            whiteSpace: "nowrap",
                          }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            )}
          </div>
        );
      })}
    </List>
  );
};

const MiniDrawerShell: FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Router>
      <Navbar />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />

        <Drawer
          variant="permanent"
          open={open}
          PaperProps={{ "aria-label": "navigation drawer" }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <Divider />
          <DrawerList open={open} />
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 0,
            pt: `${TOOLBAR_HEIGHT + 0}px`,
            transition: (theme) =>
              theme.transitions.create(["margin", "width"]),
            minHeight: `calc(100vh - ${TOOLBAR_HEIGHT}px)`,
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="customerexplorer" element={<CustomerExplorer />} />
            <Route path="/DataIntegrations" element={<DataIntegrations />} />
            <Route path="/reportsinsights" element={<ReportsInsights />} />
            <Route path="/settingsaccess" element={<SettingsAccess />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default MiniDrawerShell;
