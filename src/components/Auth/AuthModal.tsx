// AuthModal.tsx
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import AuthForm from "./AuthForm"; // adjust path as needed
import { Box } from "@mui/material";

export default function AuthModal() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [userEmail, setUserEmail] = React.useState<string>("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLoginSuccess = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    handleClose();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    handleClose();
  };

  // Show different modal if logged in
  if (isLoggedIn) {
    return (
      <div>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ textTransform: "none" }}
        >
          Account
        </Button>
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
          <DialogTitle>Your Account</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Logged in as: <strong>{userEmail}</strong>
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              You can sign out below.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleLogout} color="error" variant="contained">
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  // Not logged in – show auth modal
  return (
    <div>

      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          textTransform: "none",
          // 👇 This hides the text on extra small screens and shows only a short label
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          minWidth: { xs: "auto", sm: "64px" },
          padding: { xs: "4px 8px", sm: "6px 16px" },
        }}
      >
        {/* Show an icon on mobile, hide the long text */}
        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
          Signin / Login
        </Box>
        <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
          Signin/Login
        </Box>
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Welcome</DialogTitle>
        <DialogContent>
          <AuthForm onSuccess={handleLoginSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
