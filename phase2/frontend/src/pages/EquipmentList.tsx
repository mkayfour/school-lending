import { useEffect, useState } from "react";
import { api } from "../api";
import { type Equipment } from "../types/types";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  Box,
  Divider,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Clear, Search, Inventory2 } from "@mui/icons-material";
import toast from "react-hot-toast";

// UI helper for condition badge
function conditionChip(condition: string) {
  let color: "success" | "warning" | "error" = "success";
  let label = condition;
  switch (condition?.toLowerCase()) {
    case "good":
      color = "success";
      label = "Good";
      break;
    case "needs repair":
      color = "warning";
      label = "Needs Repair";
      break;
    case "damaged":
      color = "error";
      label = "Damaged";
      break;
    default:
      color = "warning";
      label = condition || "Unknown";
  }
  return (
    <Chip
      label={label}
      color={color}
      size="small"
      variant={color === "success" ? "filled" : "outlined"}
      sx={{ fontWeight: 500, fontSize: "1em", borderRadius: 2, px: 2 }}
    />
  );
}

function RequestButton({ equipmentId, availableQuantity }: { equipmentId: number; availableQuantity: number }) {
  const [loading, setLoading] = useState(false);

  const request = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const tomorrow = new Date(Date.now() + 24 * 3600 * 1000);
      await api.post("/borrow", {
        equipmentId,
        borrowDate: today.toISOString(),
        returnDate: tomorrow.toISOString(),
      });
      toast.success("Requested!");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Request failed");
    }
    setLoading(false);
  };

  return (
    <Button
      disabled={loading || availableQuantity <= 0}
      onClick={request}
      variant="contained"
      size="small"
      sx={{
        borderRadius: 5,
        fontWeight: 600,
        fontSize: "1em",
        minWidth: 90,
        textTransform: "none",
        boxShadow: "0 1.5px 8px #b9b2e92c",
        letterSpacing: 0.03,
        bgcolor: "#7f63e1",
        color: "#fff",
        '&:hover': { bgcolor: "#6541d4" }
      }}
    >
      {loading ? <CircularProgress size={18} color="inherit" /> : "Request"}
    </Button>
  );
}

export default function EquipmentList() {
  const { auth } = useAuth();
  const [items, setItems] = useState<Equipment[]>([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState("all");
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const load = async (options?: { clear?: boolean }) => {
    setLoading(true);
    let params: any;
    if (options?.clear) {
      params = { q: "", category: "", available: "" };
    } else {
      params = { q, category, available: available === "yes" ? 1 : "" };
    }
    try {
      const { data } = await api.get("/equipment", { params });
      setItems(data);
    } catch (e: any) {
      toast.error("Failed to load equipment");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const handleClear = async () => {
    setQ("");
    setCategory("");
    setAvailable("all");
    await load({ clear: true });
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
              avatar={<Inventory2 sx={{ fontSize: 35, color: "primary.main", mr: 1.5 }} />}
              title={
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  fontWeight={700}
                  color="primary.dark"
                  letterSpacing={0.2}
                  sx={{ mb: 0.4 }}
                >
                  Equipment Inventory
                </Typography>
              }
              sx={{ p: 0, mb: 2 }}
            />
            <Divider sx={{ mb: 2 }} />
            <CardContent sx={{ px: { xs: 0, sm: 1 }, py: 0 }}>
              {/* Filters */}
              <Paper elevation={0} sx={{ mb: 2.2, width: "100%", p: { xs: 1.4, sm: 2 }, borderRadius: 2, bgcolor: "#f6f8fa" }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  useFlexGap
                  flexWrap="wrap"
                  sx={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <TextField
                    label="Search Equipment"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    sx={{
                      minWidth: { xs: "100%", sm: 140 },
                      maxWidth: 210,
                      flex: 2,
                      background: "#fff",
                      borderRadius: 2,
                    }}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    sx={{
                      minWidth: { xs: "100%", sm: 120 },
                      maxWidth: 170,
                      flex: 2,
                      background: "#fff",
                      borderRadius: 2,
                    }}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    select
                    label="Available"
                    value={available}
                    onChange={(e) => setAvailable(e.target.value)}
                    sx={{
                      minWidth: { xs: "100%", sm: 100 },
                      maxWidth: 135,
                      flex: 1,
                      background: "#fff",
                      borderRadius: 2,
                    }}
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="all">All</MenuItem>
                  </TextField>
                  <Stack direction="row" spacing={1.5} sx={{ my: { xs: 2, sm: 0 } }}>
                    <Button
                      variant="outlined"
                      endIcon={<Clear />}
                      onClick={handleClear}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        minWidth: 90,
                        borderRadius: 2.7,
                        textTransform: "none",
                        color: "#824d95",
                        borderColor: "#c0aeda",
                        bgcolor: "#f3ebfd",
                        "&:hover": { bgcolor: "#efebfb" }
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      endIcon={<Search />}
                      variant="contained"
                      onClick={() => load()}
                      size="small"
                      sx={{
                        minWidth: 90,
                        borderRadius: 2.7,
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: "1.01em",
                        bgcolor: "#845ec2",
                        boxShadow: "0 2.5px 14px #b9b2e94d",
                        color: "#fff",
                        '&:hover': { bgcolor: "#6d48b7" }
                      }}
                    >
                      Search
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
              <Divider sx={{ width: "100%", mb: 2, color: "#eceaec" }} />

              {/* Table */}
              <Paper elevation={0} sx={{ width: "100%", overflow: 'auto', borderRadius: 3, boxShadow: 2, bgcolor: "#fff" }}>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 6 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f6f2fd !important" }}>
                        <TableCell sx={{ fontWeight: 700, color: "primary.dark", borderBottom: 2, borderColor: "#ebdfef" }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "primary.dark", borderBottom: 2, borderColor: "#ebdfef" }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "primary.dark", borderBottom: 2, borderColor: "#ebdfef" }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "primary.dark", borderBottom: 2, borderColor: "#ebdfef" }}>Condition</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "primary.dark", borderBottom: 2, borderColor: "#ebdfef" }}>Total Qty</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "primary.dark", borderBottom: 2, borderColor: "#ebdfef" }}>Available</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "primary.dark", borderBottom: 2, borderColor: "#ebdfef" }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {!loading && items.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 6, color: "grey.600" }}>
                            No equipment found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        items.map((it, idx) => (
                          <TableRow
                            key={it.id}
                            sx={{
                              background: idx % 2 ? "#fafafe" : "#fff",
                              transition: "background-color 0.15s",
                              "&:hover": { backgroundColor: "#ede6fa" }
                            }}
                          >
                            <TableCell sx={{ fontWeight: 500 }}>{it.id}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{it.name}</TableCell>
                            <TableCell>{it.category}</TableCell>
                            <TableCell>
                              {conditionChip(it.condition)}
                            </TableCell>
                            <TableCell>
                              <b>{it.quantity}</b>
                            </TableCell>
                            <TableCell>
                              <b
                                style={{
                                  color: it.availableQuantity === 0 ? "#c62828" : "#00796b",
                                }}
                              >
                                {it.availableQuantity}
                              </b>
                            </TableCell>
                            <TableCell>
                              {auth ? (
                                <RequestButton equipmentId={it.id} availableQuantity={it.availableQuantity} />
                              ) : (
                                <Typography variant="caption" sx={{ color: "grey.700" }}>
                                  Login to request
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </Paper>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
}
