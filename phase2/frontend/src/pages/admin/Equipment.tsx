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
  Box,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import toast from "react-hot-toast";

export default function AdminEquipment() {
  const [rows, setRows] = useState<Equipment[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", condition: "", quantity: 1 });

  const load = async () => {
    const { data } = await api.get("/equipment");
    setRows(data);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    try {
      await api.post("/equipment", { ...form, quantity: Number(form.quantity) });
      toast.success("Equipment added successfully");
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
    setOpen(false);
    setForm({ name: "", category: "", condition: "", quantity: 1 });
    load();
  };

  const del = async (id: number) => {
    try {
      await api.delete(`/equipment/${id}`);
      toast.success("Equipment deleted successfully");
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
    load();
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" gutterBottom>
          Admin - Equipment
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
          Add Item
        </Button>
      </Box>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#fff6fb", color: "#333" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Condition</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Qty</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Available</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.category}</TableCell>
                <TableCell>{r.condition}</TableCell>
                <TableCell>{r.quantity}</TableCell>
                <TableCell>{r.availableQuantity}</TableCell>
                <TableCell>
                  <Button variant="outlined" endIcon={<DeleteOutline />} color="error" onClick={() => del(r.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Card sx={{ minWidth: 400 }}>
          <CardHeader title="Add Equipment" />
          <Divider />
          <CardContent sx={{ pt: 2 }}>
            <TextField
              label="Name"
              fullWidth
              sx={{ mb: 2 }}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Category"
              fullWidth
              sx={{ mb: 2 }}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <TextField
              label="Condition"
              fullWidth
              sx={{ mb: 2 }}
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
            />
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            />
            <CardActions sx={{ justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={save}>
                Save
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      </Dialog>
    </Container>
  );
}
