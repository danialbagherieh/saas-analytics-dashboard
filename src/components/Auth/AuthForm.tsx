// AuthForm.tsx
import * as React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";

type Mode = "signin" | "signup" | "forgot";

interface AuthFormProps {
  onSuccess: (email: string) => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode] = React.useState<Mode>("signin");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");

  const handleSubmit = () => {
    setError("");
    setMessage("");

    if (mode === "forgot") {
      if (!email) {
        setError("Email is required");
        return;
      }
      // Simulate sending reset email
      setMessage(`Reset link sent to ${email}`);
      setTimeout(() => {
        setMode("signin");
        setMessage("");
      }, 2000);
      return;
    }

    // For signin or signup
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Mock authentication – replace with real API
    if (mode === "signin") {
      onSuccess(email);
    } else {
      onSuccess(email);
    }
  };

  // Typed event handlers
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <Stack spacing={2} sx={{ mt: 1 }}>
      {mode === "forgot" ? (
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          required
        />
      ) : (
        <>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={handleEmailChange}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={handlePasswordChange}
            required
          />
          {mode === "signup" && (
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          )}
        </>
      )}

      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}

      <Button onClick={handleSubmit} variant="contained" fullWidth>
        {mode === "signin" && "Sign In"}
        {mode === "signup" && "Sign Up"}
        {mode === "forgot" && "Send Reset Link"}
      </Button>

      {mode !== "forgot" && (
        <Button onClick={() => setMode("forgot")} color="inherit" size="small">
          Forgot password?
        </Button>
      )}

      <Divider>or</Divider>

      {mode === "signin" && (
        <Button onClick={() => setMode("signup")} color="inherit">
          Don't have an account? Sign Up
        </Button>
      )}
      {mode === "signup" && (
        <Button onClick={() => setMode("signin")} color="inherit">
          Already have an account? Sign In
        </Button>
      )}
      {mode === "forgot" && (
        <Button onClick={() => setMode("signin")} color="inherit">
          Back to Sign In
        </Button>
      )}
    </Stack>
  );
}
