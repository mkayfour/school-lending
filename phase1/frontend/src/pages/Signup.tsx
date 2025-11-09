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
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { type FormEvent, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Role } from "../types/types";

function isValidEmail(email: string) {
  // simple robust regex for typical emails
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password: string) {
  // At least 8 chars, one lower, one upper, one number
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("STUDENT" as Role);

  // Validation states
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    submit: "",
  });

  const navigation = useNavigate();

  const validate = () => {
    let valid = true;
    const newErrors: typeof errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      submit: "",
    };

    // Name validation: required, >=2 chars, no digits
    if (!name.trim()) {
      newErrors.name = "Name is required.";
      valid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
      valid = false;
    } else if (/\d/.test(name)) {
      newErrors.name = "Name must not contain numbers.";
      valid = false;
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!isValidEmail(email.trim())) {
      newErrors.email = "Enter a valid email address.";
      valid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (!isStrongPassword(password)) {
      newErrors.password = "Password must be at least 8 characters, include upper and lower case letters, and a number.";
      valid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    // Role validation
    if (!role) {
      newErrors.role = "Role selection is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await api.post("/auth/signup", { name: name.trim(), email: email.trim(), password, role });
      toast.success(`Account created. Please log in.`);
      navigation("/login");
    } catch (error: any) {
      let msg =
        (error?.response?.data && (error.response.data.error || error.response.data.message)) ||
        error?.message ||
        "Signup failed";
      setErrors((prev) => ({ ...prev, submit: msg }));
      toast.error(msg);
    }
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
        bgcolor: "#f9f9f9",
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ p: 3, borderRadius: 2, boxShadow: 2, border: "1px solid #e0e0e0" }}>
          <CardHeader title="Signup" />
          <Divider />
          <CardContent>
            <Stack direction="column" spacing={2}>
              <Box>
                <form onSubmit={handleSignup} noValidate>
                  <TextField
                    label="Name"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                    inputProps={{ maxLength: 40, autoCapitalize: "words" }}
                    required
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    autoComplete="email"
                    required
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    error={Boolean(errors.password)}
                    helperText={errors.password || "At least 8 characters, with upper/lowercase and a number."}
                    required
                  />
                  <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }}
                    error={Boolean(errors.confirmPassword)}
                    helperText={errors.confirmPassword}
                    required
                  />
                  <FormControl fullWidth sx={{ mb: 2 }} error={Boolean(errors.role)}>
                    <InputLabel id="signup-role">Role</InputLabel>
                    <Select
                      labelId="signup-role"
                      label="Role"
                      value={role}
                      onChange={(e) => {
                        setRole(e.target.value as Role);
                        setErrors((prev) => ({ ...prev, role: "" }));
                      }}
                      required
                    >
                      <MenuItem value="STUDENT">Student</MenuItem>
                      <MenuItem value="STAFF">Staff</MenuItem>
                      <MenuItem value="ADMIN">Admin</MenuItem>
                    </Select>
                    {!!errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                  </FormControl>
                  {Boolean(errors.submit) && (
                    <Box sx={{ color: "#b71c1c", mb: 1, ml: 0.5, fontSize: "0.93rem" }}>
                      {errors.submit}
                    </Box>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ fontWeight: 600, letterSpacing: 0.3, py: 1.2, fontSize: "1.08rem" }}
                  >
                    Signup
                  </Button>
                </form>
              </Box>
              <Button variant="outlined" fullWidth onClick={handleLogin}>
                Already have an account? Login
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
