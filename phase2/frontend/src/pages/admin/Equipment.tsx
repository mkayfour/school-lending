import { useEffect, useState } from "react";
import { api } from "../../api";
import { type Equipment } from "../../types/types";
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
  Dialog,
  TextField,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
  Box
} from "@mui/material";
import { AddCircle, DeleteOutline, Inventory2 } from "@mui/icons-material";
import toast from "react-hot-toast";

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
  return <Chip label={label} color={color} size="small" variant={color === "success" ? "filled" : "outlined"} sx={{ fontWeight: 500 }} />;
}

export default function AdminEquipment() {
  const [rows, setRows] = useState<Equipment[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", condition: "", quantity: 1 });
  const [saving, setSaving] = useState(false);
  const [delIdx, setDelIdx] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const load = async () => {
    const { data } = await api.get("/equipment");
    setRows(data);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!form.name.trim() || !form.category.trim() || !form.condition.trim() || !form.quantity) {
      toast.error("Please fill all fields.");
      return;
    }
    setSaving(true);
    try {
      await api.post("/equipment", { ...form, quantity: Number(form.quantity) });
      toast.success("Equipment added successfully");
      setOpen(false);
      setForm({ name: "", category: "", condition: "", quantity: 1 });
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add equipment.");
    }
    setSaving(false);
  };

  const del = async (id: number) => {
    setDelIdx(id);
    try {
      await api.delete(`/equipment/${id}`);
      toast.success("Equipment deleted successfully");
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete");
    }
    setDelIdx(null);
  };

  return (
    <Container maxWidth="md" sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 1 : 3, minHeight: "90vh" }}>
      <Card
        sx={{
          borderRadius: 3,
          p: { xs: 0, sm: 2.6 },
          pt: { xs: 1, sm: 2.4 },
          boxShadow: "0 8px 28px 2px #d8d7e622",
          background: "#fafafb",
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Inventory2 color="primary" sx={{ fontSize: 37, mr: 1, ml: 0.5 }} />
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700} color="primary.dark" letterSpacing={0.2}>
              Equipment Inventory <span style={{ color: "#845ec2", fontWeight: 500, fontSize: "0.7em", marginLeft: 8 }}>[Admin]</span>
            </Typography>
          </Stack>
          <Button
            variant="contained"
            startIcon={<AddCircle />}
            onClick={() => setOpen(true)}
            sx={{
              borderRadius: 5,
              letterSpacing: 0.18,
              fontWeight: 700,
              fontSize: "1.01em",
              boxShadow: "0 2.5px 14px #b9b2e94d",
              py: 1.05,
              minWidth: 115,
              mr: { xs: 0, sm: 0.5 },
            }}
            disableElevation
          >
            Add Item
          </Button>
        </Stack>
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
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Condition</TableCell>
                <TableCell align="center">Qty</TableCell>
                <TableCell align="center">Available</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: "grey.600", fontSize: "1.04em" }}>
                    No equipment found.
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
                      <TableCell><b>{r.id}</b></TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#3a237e" }}>{r.name}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{r.category}</TableCell>
                      <TableCell>
                        {conditionChip(r.condition)}
                      </TableCell>
                      <TableCell align="center">
                        <b style={{ color: "#5022b3" }}>{r.quantity}</b>
                      </TableCell>
                      <TableCell align="center">
                        <b style={{ color: r.availableQuantity === 0 ? "#d32f2f" : "#009688" }}>
                          {r.availableQuantity}
                        </b>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete" placement="top">
                          <span>
                            <IconButton
                              color="error"
                              size="small"
                              disabled={delIdx === r.id}
                              onClick={() => del(r.id)}
                              sx={{
                                borderRadius: 2.7,
                                bgcolor: delIdx === r.id ? "#f6d1de" : "#ffebee",
                                transition: "all 0.13s",
                                boxShadow: delIdx === r.id ? 2 : 0,
                                '&:hover': {
                                  bgcolor: "#ffdada",
                                  boxShadow: 2
                                }
                              }}
                            >
                              <DeleteOutline fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  </Fade>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Card>
      <Dialog
        open={open}
        onClose={() => !saving && setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            p: 0,
            borderRadius: 4,
            boxShadow: 12,
            background: "linear-gradient(135deg,#fafbfc 70%,#ede7fa 100%)",
            overflow: "visible",
          }
        }}
      >
        <Box position="relative">
          <IconButton
            aria-label="close"
            onClick={() => !saving && setOpen(false)}
            sx={{
              position: "absolute",
              right: 12,
              top: 10,
              zIndex: 3,
              color: "#b39ddb",
              bgcolor: "#f6f8fa",
              "&:hover": { bgcolor: "#ede7fa", color: "#512da8" },
            }}
            size="small"
            disabled={saving}
          >
            <span style={{ fontSize: 21, fontWeight: 700, lineHeight: 1 }}>×</span>
          </IconButton>
          <Card elevation={0} sx={{ borderRadius: 4, boxShadow: "none", pb: 1 }}>
            <CardHeader
              title={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: "#ede7fa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <rect x="4" y="9" width="14" height="9" rx="2" fill="#7e57c2"/>
                      <rect x="6" y="2" width="10" height="6" rx="1" fill="#d1c4e9"/>
                    </svg>
                  </Box>
                  <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ letterSpacing: 0.1 }}>
                    Add New Equipment
                  </Typography>
                </Stack>
              }
              sx={{ pb: 1, pt: 3.3, px: 3, background: "transparent" }}
            />
            <Divider variant="middle" sx={{ bgcolor: "#ece9fc", mb: 1.5, mx: 2 }} />
            <CardContent sx={{ pt: 0, px: 3 }}>
              <Stack
                spacing={2.1}
                component="form"
                autoComplete="off"
                onSubmit={e => { e.preventDefault(); save(); }}
                sx={{ pb: 1 }}
              >
                <TextField
                  label="Name"
                  placeholder="e.g., Basketball"
                  fullWidth
                  required
                  autoFocus
                  disabled={saving}
                  variant="outlined"
                  value={form.name}
                  sx={{
                    bgcolor: "#f6f8fa",
                    borderRadius: 2
                  }}
                  inputProps={{ maxLength: 40, autoComplete: "off" }}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <TextField
                  label="Category"
                  placeholder="e.g., Sports, Electronics"
                  fullWidth
                  required
                  disabled={saving}
                  variant="outlined"
                  value={form.category}
                  sx={{ bgcolor: "#f6f8fa", borderRadius: 2 }}
                  inputProps={{ maxLength: 40, autoComplete: "off" }}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
                <TextField
                  label="Condition"
                  placeholder="Good, Needs Repair, Damaged..."
                  fullWidth
                  required
                  disabled={saving}
                  variant="outlined"
                  value={form.condition}
                  sx={{ bgcolor: "#f6f8fa", borderRadius: 2 }}
                  inputProps={{ maxLength: 30, autoComplete: "off" }}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                />
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  required
                  disabled={saving}
                  variant="outlined"
                  inputProps={{ min: 1, max: 999 }}
                  value={form.quantity}
                  sx={{ bgcolor: "#f6f8fa", borderRadius: 2 }}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value.replace(/[^\d]/g, "")) || 1 })}
                />
              </Stack>
            </CardContent>
            <CardActions sx={{
              justifyContent: "flex-end",
              px: 3,
              pb: 2,
              pt: 1,
              bgcolor: "#fcfaff",
              borderBottomLeftRadius: 14,
              borderBottomRightRadius: 14
            }}>
              <Button
                onClick={() => setOpen(false)}
                disabled={saving}
                sx={{
                  mr: 1.5,
                  fontWeight: 600,
                  letterSpacing: 0.09,
                  px: 2.2,
                  borderRadius: 2,
                  color: "#7e57c2"
                }}
                color="inherit"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                onClick={save}
                disabled={saving}
                sx={{
                  fontWeight: 700,
                  px: 3,
                  py: 1.1,
                  borderRadius: 2,
                  textTransform: "none",
                  letterSpacing: 0.14,
                  boxShadow: "0 2px 8px #7e57c233"
                }}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Dialog>
    </Container>
  );
}
