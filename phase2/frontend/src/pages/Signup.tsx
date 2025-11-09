import {
  Button,
  Container,
  TextField,
  Box,
  Card,
  Stack,
  CardContent,
  Divider,
  CardHeader,
  MenuItem,
  Select,
  InputAdornment,
  IconButton,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Visibility, VisibilityOff, PersonAdd, ArrowBack, Email, Lock, Person, HowToReg } from "@mui/icons-material";
import { type FormEvent, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Role } from "../types/types";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("STUDENT" as Role);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigate();

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/signup", { name, email, password, role });
      toast.success(`Account created. Please log in.`);
      navigation("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Signup failed");
    }
    setLoading(false);
  };

  const handleLogin = () => {
    navigation("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "linear-gradient(135deg, #f3f6fd 0%, #ede7f6 80%)",
      }}
    >
      {/*
        Increase the width for the signup page.
        maxWidth="sm" allows more content width (default was "xs").
      */}
      <Container maxWidth="sm">
        <Card
          sx={{
            py: 4,
            // Increase horizontal padding on wider screens for a better look
            px: { xs: 2, sm: 6, md: 7 },
            borderRadius: 3,
            boxShadow: "0 6px 24px 5px #e6e6ee8a",
            border: "1.5px solid #e0e0e0",
            background: "#ffffffdf",
            position: "relative",
          }}
        >
          <CardHeader
            avatar={<PersonAdd color="primary" sx={{ fontSize: 38, mr: 1.5 }} />}
            title={
              <Typography
                variant="h5"
                fontWeight={700}
                color="primary"
                align="center"
                letterSpacing={0.6}
              >
                Create Your Account
              </Typography>
            }
            sx={{ p: 0, mb: 2 }}
          />
          <Divider sx={{ mb: 2 }} />
          <CardContent sx={{ px: { xs: 0, sm: 1 }, pb: 0 }}>
            <form onSubmit={handleSignup} autoComplete="off">
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  required
                  fullWidth
                  inputProps={{ maxLength: 60 }}
                  sx={{
                    '.MuiInputBase-root': { bgcolor: "#f6f8fa" }
                  }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  autoFocus
                />
                <TextField
                  label="Email"
                  required
                  type="email"
                  fullWidth
                  inputProps={{ maxLength: 80 }}
                  sx={{
                    '.MuiInputBase-root': { bgcolor: "#f6f8fa" }
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Password"
                  required
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  inputProps={{ maxLength: 40 }}
                  sx={{
                    '.MuiInputBase-root': { bgcolor: "#f6f8fa" }
                  }}
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirm Password"
                  required
                  type={showConfirm ? "text" : "password"}
                  fullWidth
                  inputProps={{ maxLength: 40 }}
                  sx={{
                    '.MuiInputBase-root': { bgcolor: "#f6f8fa" }
                  }}
                  value={confirmPassword}
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirm((v) => !v)}
                          edge="end"
                          aria-label="toggle confirm password visibility"
                        >
                          {showConfirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl fullWidth sx={{ mb: 0.5 }}>
                  <InputLabel id="role-select-label" sx={{ bgcolor: "#f6f8fa", px: 0.5 }}>
                    Role
                  </InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    label="Role"
                    displayEmpty
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    sx={{
                      bgcolor: "#f6f8fa",
                      borderRadius: "6px"
                    }}
                    renderValue={(selected) => {
                      if (!selected) return <span style={{ color: "#bbb" }}>Select Role</span>;
                      const map = {STUDENT: "Student", STAFF: "Staff", ADMIN: "Admin"};
                      return map[selected as string] || selected;
                    }}
                    MenuProps={{
                      PaperProps: { sx: { mt: 1.1 } }
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Role</em>
                    </MenuItem>
                    <MenuItem value="STUDENT">Student</MenuItem>
                    <MenuItem value="STAFF">Staff</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  disabled={
                    loading ||
                    !name.trim() ||
                    !email.trim() ||
                    !password.trim() ||
                    !confirmPassword.trim() ||
                    password.length < 4 ||
                    name.length < 2
                  }
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{
                    py: 1.4,
                    fontWeight: 700,
                    fontSize: "1.09em",
                    textTransform: "none",
                    letterSpacing: "0.05em",
                    boxShadow: "0 2px 10px #7345c80a",
                  }}
                  startIcon={<HowToReg />}
                  endIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                >
                  {loading ? "Signing Up..." : "Signup"}
                </Button>
              </Stack>
            </form>
            <Divider sx={{ my: 2, color: "#ebe7fa" }}>
              <Typography variant="caption" sx={{ color: "#aaa" }}>
                or
              </Typography>
            </Divider>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleLogin}
              startIcon={<ArrowBack />}
              sx={{
                py: 1.2,
                borderRadius: 2.7,
                fontWeight: 600,
                fontSize: "1em",
                textTransform: "none",
                bgcolor: "#fff",
              }}
              color="secondary"
            >
              Already have an account? Login
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
