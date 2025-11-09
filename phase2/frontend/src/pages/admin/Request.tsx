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
} from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import toast from "react-hot-toast";

export default function AdminRequests() {
  const [rows, setRows] = useState<BorrowRequest[]>([]);
  const load = async () => {
    const { data } = await api.get("/borrow/all");
    setRows(data);
  };
  useEffect(() => {
    load();
  }, []);

  const act = async (id: number, action: "approve" | "reject" | "return") => {
    try {
      await api.put(`/borrow/${id}/${action}`);
      toast.success("Request updated successfully");
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
    load();
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Admin - Requests
      </Typography>
      <Paper>
        <Table>
          <TableHead sx={{ backgroundColor: "#fff6fb", color: "#333" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Requester</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Borrow</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Return</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>
                  {r.User?.name} ({r.User?.role})
                </TableCell>
                <TableCell>{r.Equipment?.name}</TableCell>
                <TableCell>{r.status}</TableCell>
                <TableCell>{new Date(r.borrowDate).toLocaleString()}</TableCell>
                <TableCell>{new Date(r.returnDate).toLocaleString()}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      disabled={r.status !== "REQUESTED"}
                      variant="outlined"
                      endIcon={<Check />}
                      color="success"
                      onClick={() => act(r.id, "approve")}
                    >
                      Approve
                    </Button>
                    <Button
                      disabled={r.status !== "REQUESTED"}
                      variant="outlined"
                      endIcon={<Close />}
                      color="error"
                      onClick={() => act(r.id, "reject")}
                    >
                      Reject
                    </Button>
                    <Button
                      disabled={r.status !== "APPROVED"}
                      variant="outlined"
                      endIcon={<Check />}
                      color="success"
                      onClick={() => act(r.id, "return")}
                    >
                      Mark Returned
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
