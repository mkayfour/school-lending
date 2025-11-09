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
} from "@mui/material";
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

  const handleSignup = async (e: FormEvent) => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/signup", { name, email, password, role: "ADMIN" });
      toast.success(`Account created. Please log in.`);
      navigation("/login");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const navigation = useNavigate();

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
                <form onSubmit={handleSignup}>
                  <TextField
                    label="Name"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Select label="Role" fullWidth sx={{ mb: 2 }} value={role} onChange={(e) => setRole(e.target.value)}>
                    <MenuItem value="STUDENT">Student</MenuItem>
                    <MenuItem value="STAFF">Staff</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </Select>
                  <Button onClick={handleSignup} variant="contained" fullWidth>
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
