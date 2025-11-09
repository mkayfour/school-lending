import {
  Button,
  Container,
  TextField,
  Stack,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Login as LoginIcon, PersonAdd as SignupIcon, Email as EmailIcon, Lock as LockIcon } from "@mui/icons-material";
import { type FormEvent, useState } from "react";
import { api } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigation = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await api
      .post("/auth/login", { email, password })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Failed to login");
        setLoading(false);
        return null;
      });

    if (!response) {
      setLoading(false);
      return;
    }

    const { data } = response;
    toast.success(`Logged in as ${data.name}`);
    login(data.token, data.role, data.name);
    setLoading(false);
    navigation("/");
  };

  const handleSignup = () => {
    navigation("/signup");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "linear-gradient(135deg, #ede7f6, #e3f2fd 90%)",
      }}
    >
      <Container maxWidth="xs">
        <Card
          sx={{
            py: 4,
            px: { xs: 2, sm: 5 },
            borderRadius: 3,
            boxShadow: "0 6px 24px 5px #e6e6ee8a",
            border: "1.5px solid #e0e0e0",
            background: "#ffffffd9",
          }}
        >
          <CardHeader
            title={
              <Typography
                variant="h5"
                fontWeight={700}
                color="primary"
                align="center"
                letterSpacing={0.6}
              >
                Welcome Back
              </Typography>
            }
            sx={{ p: 0, mb: 2 }}
          />
          <Divider />
          <CardContent sx={{ px: { xs: 0, sm: 1 }, pb: 0 }}>
            <form onSubmit={handleLogin} autoComplete="off">
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  type="email"
                  required
                  fullWidth
                  autoFocus
                  inputProps={{ maxLength: 80 }}
                  sx={{
                    '.MuiInputBase-root': { bgcolor: "#f6f8fa" }
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Password"
                  type={showPass ? "text" : "password"}
                  required
                  fullWidth
                  autoComplete="current-password"
                  inputProps={{ maxLength: 40 }}
                  sx={{
                    '.MuiInputBase-root': { bgcolor: "#f6f8fa" }
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPass((v) => !v)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  disabled={loading || email.trim() === "" || password.trim() === ""}
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    mt: 0.5,
                    py: 1.4,
                    fontWeight: "bold",
                    letterSpacing: "0.06em",
                    fontSize: "1.07em",
                    boxShadow: "0 2px 10px #7345c80a",
                    textTransform: "none",
                  }}
                  startIcon={<LoginIcon />}
                  endIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                >
                  {loading ? "Logging In..." : "Login"}
                </Button>
                <Divider sx={{ my: 1.2, color: "#ebe7fa" }}>
                  <Typography variant="caption" sx={{ color: "#bbb" }}>
                    or
                  </Typography>
                </Divider>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    py: 1.2,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1em",
                  }}
                  startIcon={<SignupIcon />}
                  onClick={handleSignup}
                  color="secondary"
                >
                  Need an account? Signup
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
