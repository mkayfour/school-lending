import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Login, Logout, PersonAdd } from "@mui/icons-material";

export default function NavBar() {
  const { auth, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography component={Link} to="/" variant="h6" sx={{ color: "inherit", textDecoration: "none", flexGrow: 1 }}>
          School Equipment Lending Portal
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {auth && auth.role === "STUDENT" &&<Button color="inherit" component={Link} to="/">
            Equipment
          </Button>}
          {auth && auth.role === "STUDENT" && (
            <Button color="inherit" component={Link} to="/requests">
              My Requests
            </Button>
          )}
          {(auth?.role === "ADMIN" || auth?.role === "STAFF") && (
            <>
              <Button color="inherit" component={Link} to="/admin/equipment">
                Admin Equip
              </Button>
              <Button color="inherit" component={Link} to="/admin/requests">
                Admin Requests
              </Button>
            </>
          )}
          {auth ? (
            <Button endIcon={<Logout />} color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button endIcon={<Login />} color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
          {auth ? (
            <></>
          ) : (
            <Button endIcon={<PersonAdd />} color="inherit" component={Link} to="/signup">
              Signup
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
