import { Button, Container, TextField, Stack, Box, Card, CardContent, CardHeader, Divider } from "@mui/material";
import { type FormEvent, useState } from "react";
import { api } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const navigation = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const response = await api.post("/auth/login", { email, password }).catch((error) => {
      toast.error(error.response.data.error);
      return null;
    });

    if (!response) return;

    const { data } = response;

    toast.success(`Logged in as ${data.name}`);

    login(data.token, data.role, data.name);

    navigation("/");
  };

  const handleSignup = async () => {
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
                <form onSubmit={handleLogin}>
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
                  <Button type="submit" variant="contained" fullWidth>
                    Login
                  </Button>
                </form>
              </Box>
              <Button variant="outlined" fullWidth onClick={handleSignup}>
                Need an account? Signup
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
