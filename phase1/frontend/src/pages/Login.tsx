import { Button, Container, TextField, Stack, Box, Card, CardContent, CardHeader, Divider } from "@mui/material";
import { type FormEvent, useState } from "react";
import { api } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Robust email validator (same as Signup)
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    submit: "",
  });

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const navigation = useNavigate();

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "", submit: "" };

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!isValidEmail(email.trim())) {
      newErrors.email = "Enter a valid email address.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setErrors((errs) => ({ ...errs, submit: "" }));

    if (!validate()) return;

    setLoading(true);
    const response = await api
      .post("/auth/login", { email, password })
      .catch((error) => {
        setErrors((errs) => ({
          ...errs,
          submit:
            error?.response?.data?.error ||
            "Unable to login. Please check your credentials.",
        }));
        setLoading(false);
        return null;
      });

    if (!response) return;

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
        bgcolor: "#f9f9f9",
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ p: 3, borderRadius: 2, boxShadow: 2, border: "1px solid #e0e0e0" }}>
          <CardHeader title="Login" />
          <Divider />
          <CardContent>
            <Stack direction="column" spacing={2}>
              <Box>
                <form onSubmit={handleLogin} noValidate>
                  <TextField
                    label="Email"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((errs) => ({ ...errs, email: "" }));
                    }}
                    error={!!errors.email}
                    helperText={errors.email}
                    autoComplete="email"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((errs) => ({ ...errs, password: "" }));
                    }}
                    error={!!errors.password}
                    helperText={errors.password}
                    autoComplete="current-password"
                  />
                  {errors.submit && (
                    <Box sx={{ color: "#d32f2f", mb: 1, fontSize: 15 }}>{errors.submit}</Box>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Box>
              <Button variant="outlined" fullWidth onClick={handleSignup} disabled={loading}>
                Need an account? Signup
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
