import { useEffect, useState } from "react";
import { api } from "../../api";
import { type BorrowRequest } from "../../types/types";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
  Card,
  CardHeader,
  Divider,
  Chip,
  Tooltip,
  CircularProgress,
  Fade,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Check, Close, AssignmentInd } from "@mui/icons-material";
import toast from "react-hot-toast";

// Helper: pretty date formatting
function prettyDate(date?: string | null) {
  if (!date) return "—";
  const d = new Date(date);
  return (
    <Tooltip title={d.toLocaleString()}>
      <span>
        {d.toLocaleDateString()}
        <br />
        {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </Tooltip>
  );
}

export default function AdminRequests() {
  const [rows, setRows] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actLoading, setActLoading] = useState<number | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/borrow/all");
      setRows(data);
    } catch (e) {
      toast.error("Failed to load requests");
    }
    setLoading(false);
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const act = async (id: number, action: "approve" | "reject" | "return") => {
    setActLoading(id);
    try {
      await api.put(`/borrow/${id}/${action}`);
      toast.success("Request updated successfully");
      await load();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Update failed");
    }
    setActLoading(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: isMobile ? 1.2 : 4, mb: isMobile ? 1 : 3, minHeight: "90vh" }}>
      <Card
        sx={{
          borderRadius: 3,
          p: { xs: 0, sm: 2.6 },
          pt: { xs: 1, sm: 2.4 },
          boxShadow: "0 8px 28px 2px #d8d7e622",
          background: "#fafafb",
        }}
      >
        <CardHeader
          avatar={<AssignmentInd color="primary" sx={{ fontSize: 37 }} />}
          title={
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700} color="primary.dark" letterSpacing={0.2}>
              Borrow Requests <span style={{ color: "#845ec2", fontWeight: 500, fontSize: "0.7em", marginLeft: 8 }}>[Admin]</span>
            </Typography>
          }
          sx={{ p: 0, mb: 1.4 }}
        />
        <Divider sx={{ mb: 2, background: "#e8e7fb" }} />
        <Paper sx={{ borderRadius: 3, boxShadow: 0, overflow: 'hidden', background: "#f7f8fa" }}>
          <Table
            size={isMobile ? "small" : "medium"}
            stickyHeader
            sx={{
              "& .MuiTableCell-head": {
                bgcolor: "#ede7fa",
                color: "primary.dark",
                fontWeight: 700,
                fontSize: "1.08em"
              }
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Requester</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Borrow</TableCell>
                <TableCell>Return</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={30} color="secondary" />
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: "grey.600" }}>
                    No requests found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r, idx) => (
                  <Fade in key={r.id} timeout={500 + idx * 80}>
                    <TableRow
                      sx={{
                        background: idx % 2 ? "#f7fbff" : "#fff",
                        transition: 'background-color 0.17s',
                        "&:hover": {
                          backgroundColor: "#ede7fa66",
                        }
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600, color: "#3a237e" }}>{r.id}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.7} alignItems="center">
                          <Chip
                            label={r.User?.name ?? "—"}
                            size="small"
                            sx={{
                              px: 1.2,
                              fontWeight: 600,
                              bgcolor: "#ece7fb",
                              color: "#3a276a",
                              fontSize: "0.97em",
                              borderRadius: "11px"
                            }}
                          />
                          <Chip
                            label={r.User?.role ?? "—"}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              fontSize: "0.88em",
                              color:
                                r.user?.role === "ADMIN"
                                  ? "#d32f2f"
                                  : r.user?.role === "STAFF"
                                  ? "#307fff"
                                  : "#388e3c",
                              bgcolor:
                                r.user?.role === "ADMIN"
                                  ? "#ffe5e2"
                                  : r.user?.role === "STAFF"
                                  ? "#e3f0fa"
                                  : "#e2faea",
                              borderRadius: "9px"
                            }}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500, color: "#6741a9" }}>
                        {r.Equipment?.name ?? "—"}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap", color: "#7749a5" }}>
                        <b>{prettyDate(r.borrowDate)}</b>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <b>{prettyDate(r.returnDate)}</b>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button
                            disabled={r.status !== "REQUESTED" || !!actLoading}
                            variant="contained"
                            endIcon={
                              actLoading === r.id && r.status === "REQUESTED" ? (
                                <CircularProgress size={17} color="inherit" />
                              ) : (
                                <Check />
                              )
                            }
                            color="success"
                            size="small"
                            onClick={() => act(r.id, "approve")}
                            sx={{
                              borderRadius: 20,
                              fontWeight: "bold",
                              fontSize: "0.98em",
                              px: 2,
                              minWidth: 0,
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            disabled={r.status !== "REQUESTED" || !!actLoading}
                            variant="outlined"
                            endIcon={
                              actLoading === r.id && r.status === "REQUESTED" ? (
                                <CircularProgress size={17} color="inherit" />
                              ) : (
                                <Close />
                              )
                            }
                            color="error"
                            size="small"
                            onClick={() => act(r.id, "reject")}
                            sx={{
                              borderRadius: 20,
                              fontWeight: "bold",
                              fontSize: "0.98em",
                              px: 2,
                              minWidth: 0,
                            }}
                          >
                            Reject
                          </Button>
                          <Button
                            disabled={r.status !== "APPROVED" || !!actLoading}
                            variant="contained"
                            endIcon={
                              actLoading === r.id && r.status === "APPROVED" ? (
                                <CircularProgress size={17} color="inherit" />
                              ) : (
                                <Check />
                              )
                            }
                            color="success"
                            size="small"
                            onClick={() => act(r.id, "return")}
                            sx={{
                              borderRadius: 20,
                              fontWeight: "bold",
                              fontSize: "0.98em",
                              px: 2,
                              minWidth: 0,
                              bgcolor: "#44bb77",
                              "&:hover": {
                                bgcolor: "#31975d"
                              }
                            }}
                          >
                            Mark Returned
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </Fade>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Card>
    </Container>
  );
}
