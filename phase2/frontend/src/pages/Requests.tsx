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
  Paper,
  CircularProgress,
} from "@mui/material";

export default function Requests() {
  const [rows, setRows] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/borrow/my");
    setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        My Requests
      </Typography>
      <Paper>
        <Table>
          <TableHead sx={{ backgroundColor: "#fff6fb", color: "#333" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Borrow</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Return</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && <CircularProgress />}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="body1">No requests found</Typography>
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.equipment?.name || r.equipmentId}</TableCell>
                <TableCell>{r.status}</TableCell>
                <TableCell>{new Date(r.borrowDate).toLocaleString()}</TableCell>
                <TableCell>{new Date(r.returnDate).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
