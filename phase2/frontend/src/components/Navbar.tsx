import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  IconButton,
  useTheme,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Login, Logout, PersonAdd, Person, AdminPanelSettings, Inventory2, ListAlt, AssignmentInd } from "@mui/icons-material";
import { useState } from "react";

export default function NavBar() {
  const { auth, logout } = useAuth();
  const nav = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Menu items depending on roles
  const navLinks = [];

  if (auth && auth.role === "STUDENT") {
    navLinks.push(
      <MenuItem
        key="equipment"
        component={Link}
        to="/"
        onClick={handleMenuClose}
      >
        <ListItemIcon>
          <Inventory2 fontSize="small" />
        </ListItemIcon>
        Equipment
      </MenuItem>,
      <MenuItem
        key="requests"
        component={Link}
        to="/requests"
        onClick={handleMenuClose}
      >
        <ListItemIcon>
          <ListAlt fontSize="small" />
        </ListItemIcon>
        My Requests
      </MenuItem>
    );
  }

  if (auth && (auth.role === "ADMIN" || auth.role === "STAFF")) {
    navLinks.push(
      <MenuItem
        key="adminEquipment"
        component={Link}
        to="/admin/equipment"
        onClick={handleMenuClose}
      >
        <ListItemIcon>
          <AdminPanelSettings fontSize="small" />
        </ListItemIcon>
        Admin Equip
      </MenuItem>,
      <MenuItem
        key="adminRequests"
        component={Link}
        to="/admin/requests"
        onClick={handleMenuClose}
      >
        <ListItemIcon>
          <AssignmentInd fontSize="small" />
        </ListItemIcon>
        Admin Requests
      </MenuItem>
    );
  }

  return (
    <AppBar
      position="static"
      color="primary"
      sx={{
        background:
          "linear-gradient(90deg, #6d48f5 0%, #ab47bc 100%)",
        boxShadow: "0 4px 24px 0 rgb(122 106 224 / 12%)",
      }}
      elevation={3}
    >
      <Toolbar>
        <Typography
          component={Link}
          to="/"
          variant="h6"
          noWrap
          sx={{
            color: "white",
            textDecoration: "none",
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: 1,
            fontFamily: "system-ui, Roboto, sans-serif",
          }}
        >
          School Equipment Lending Portal
        </Typography>

        {/* On mobile, use a menu */}
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="end"
              size="large"
              sx={{ ml: 1 }}
              onClick={handleMenuOpen}
              aria-label="open navigation menu"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              {navLinks}
              {auth ? (
                <>
                  <Divider />
                  <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </>
              ) : (
                [
                  <MenuItem
                    key="menu-login"
                    component={Link}
                    to="/login"
                    onClick={handleMenuClose}
                  >
                    <ListItemIcon>
                      <Login fontSize="small" />
                    </ListItemIcon>
                    Login
                  </MenuItem>,
                  <MenuItem
                    key="menu-signup"
                    component={Link}
                    to="/signup"
                    onClick={handleMenuClose}
                  >
                    <ListItemIcon>
                      <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    Signup
                  </MenuItem>
                ]
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {navLinks.map((item, idx) => (
              <Box key={idx}>{item}</Box>
            ))}
            {auth ? (
              <Button
                endIcon={<Logout />}
                color="inherit"
                onClick={handleLogout}
                sx={{
                  fontWeight: 600,
                  px: 2,
                  borderRadius: 2
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  endIcon={<Login />}
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{
                    fontWeight: 600,
                    px: 2,
                    borderRadius: 2
                  }}
                >
                  Login
                </Button>
                <Button
                  endIcon={<PersonAdd />}
                  color="inherit"
                  component={Link}
                  to="/signup"
                  sx={{
                    fontWeight: 600,
                    px: 2,
                    borderRadius: 2
                  }}
                >
                  Signup
                </Button>
              </>
            )}
            {auth && (
              <Tooltip
                title={
                  <Box>
                    <Typography variant="body2" color="inherit" fontWeight={600}>
                      {auth.name || "User"}
                    </Typography>
                    <Typography variant="caption" color="inherit">
                      {auth.role}
                    </Typography>
                  </Box>
                }
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    ml: 2,
                    bgcolor: theme.palette.secondary.light,
                    color: theme.palette.secondary.contrastText,
                    fontWeight: "bold",
                    fontSize: "1.1em",
                    border: "2px solid #fff",
                    boxShadow: "0 1px 6px #a96bf340"
                  }}
                  alt={auth.name || "User"}
                >
                  {(auth?.name?.charAt(0) || "").toUpperCase()}
                </Avatar>
              </Tooltip>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
