import { useEffect, useState } from "react";
import { api } from "../api";
import { type BorrowRequest } from "../types/types";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  Box,
  Chip,
  Tooltip,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { CheckCircle, HourglassBottom, Cancel, ListAlt } from "@mui/icons-material";

function statusChip(status: string) {
  // Add more statuses and icons if needed
  let color: "success" | "error" | "warning" | "default" = "default";
  let icon = null;
  let label = status;

  switch (status) {
    case "APPROVED":
      color = "success";
      icon = <CheckCircle sx={{ fontSize: 18 }} />;
      label = "Approved";
      break;
    case "PENDING":
      color = "warning";
      icon = <HourglassBottom sx={{ fontSize: 18 }} />;
      label = "Pending";
      break;
    case "REJECTED":
    case "DENIED":
      color = "error";
      icon = <Cancel sx={{ fontSize: 18 }} />;
      label = "Rejected";
      break;
    default:
      color = "default";
      icon = <HourglassBottom sx={{ fontSize: 18 }} />;
      label = status;
  }
  return (
    <Chip
      icon={icon}
      label={label}
      color={color}
      sx={{ fontWeight: 600, fontSize: "0.97em", px: 0.8, minWidth: 92, letterSpacing: 0.13 }}
      variant={color === "default" ? "outlined" : "filled"}
      size="small"
    />
  );
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return <span style={{ color: "#bbb" }}>—</span>;
  const date = new Date(dateStr);
  return (
    <Tooltip title={date.toLocaleString()}>
      <span>
        {date.toLocaleDateString()}
        <br />
        {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </Tooltip>
  );
}

export default function Requests() {
  const [rows, setRows] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/borrow/my");
      setRows(data);
    } catch (e) {
      setRows([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

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
      <Container maxWidth="md" sx={{ my: { xs: 2, sm: 5 } }}>
        <Fade in>
          <Card
            sx={{
              boxShadow: "0 8px 28px 2px #d8d7e622",
              borderRadius: 4,
              px: { xs: 1, sm: 3 },
              py: { xs: 1.5, sm: 3.2 },
              bgcolor: "#fafafb",
            }}
          >
            <CardHeader
              avatar={<ListAlt sx={{ fontSize: 32, color: "primary.main", mr: 1.5 }} />}
              title={
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  fontWeight={700}
                  color="primary.dark"
                  letterSpacing={0.2}
                  sx={{ mb: 0.4 }}
                >
                  My Requests
                </Typography>
              }
              sx={{ p: 0, mb: 2 }}
            />
            <Divider sx={{ mb: 2 }} />
            <CardContent sx={{ px: { xs: 0, sm: 1 }, py: 0 }}>
              <Paper
                elevation={0}
                sx={{
                  width: "100%",
                  p: { xs: 0.2, sm: 0.5 },
                  borderRadius: 2,
                  boxShadow: "none",
                  bgcolor: "transparent",
                }}
              >
                <TableContainer sx={{ borderRadius: 2, bgcolor: "#fff" }}>
                  <Table size="medium">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f6f4fd" }}>
                        <TableCell sx={{ fontWeight: "bold", color: "primary.dark", pl: 2 }}>
                          #
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#5242A3" }}>
                          Item
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                          Status
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                          Borrow Date
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                          Return Date
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading && (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <Box display="flex" alignItems="center" justifyContent="center" py={3}>
                              <CircularProgress />
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                      {!loading && rows.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                            <Typography variant="body1" sx={{ color: "#888" }}>
                              No requests found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                      {rows.map((r, idx) => (
                        <TableRow
                          key={r.id}
                          sx={{
                            background: idx % 2 ? "#fafbff" : "#fff",
                            "&:hover": { backgroundColor: "#ece8fd40" },
                            transition: "background 0.18s",
                          }}
                        >
                          <TableCell sx={{ pl: 2, fontWeight: 400 }}>{r.id}</TableCell>
                          <TableCell>
                            {r.equipment?.name || (
                              <span style={{ color: "#bbb" }}>{r.equipmentId}</span>
                            )}
                          </TableCell>
                          <TableCell>{statusChip(r.status)}</TableCell>
                          <TableCell>{formatDate(r.borrowDate)}</TableCell>
                          <TableCell>{formatDate(r.returnDate)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
}
