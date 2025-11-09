import { useEffect, useState } from "react";
import { api } from "../api";
import { type Equipment } from "../types/types";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  CardActions,
  Button,
  MenuItem,
  Stack,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Clear, Search } from "@mui/icons-material";
import toast from "react-hot-toast";

function RequestButton({ equipmentId, availableQuantity }: { equipmentId: number; availableQuantity: number }) {
  const [loading, setLoading] = useState(false);

  const request = async () => {
    setLoading(true);
    const today = new Date();
    const tomorrow = new Date(Date.now() + 24 * 3600 * 1000);
    await api.post("/borrow", {
      equipmentId,
      borrowDate: today.toISOString(),
      returnDate: tomorrow.toISOString(),
    });
    setLoading(false);
    toast.success("Requested!");
  };

  return (
    <Button disabled={loading || availableQuantity <= 0} onClick={request} variant="contained">
      Request item
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

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/equipment", {
      params: { q, category, available: available === "yes" ? 1 : "" },
    });
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, []);

  return (
    <Container
      sx={{
        mt: 3,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
      }}
      maxWidth="xl"
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Equipment
        </Typography>

        <Grid
          container
          spacing={2}
          sx={{
            mb: 2,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
          alignItems="center"
        >
          <Grid sx={{ xs: 12, md: 4 }}>
            <TextField label="Search" fullWidth value={q} onChange={(e) => setQ(e.target.value)} />
          </Grid>
          <Grid sx={{ xs: 6, md: 4 }}>
            <TextField label="Category" fullWidth value={category} onChange={(e) => setCategory(e.target.value)} />
          </Grid>
          <Grid sx={{ xs: 6, md: 2 }}>
            <TextField
              select
              label="Available"
              fullWidth
              value={available}
              onChange={(e) => setAvailable(e.target.value)}
              sx={{ width: "100px" }}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="all">All</MenuItem>
            </TextField>
          </Grid>
          <Grid sx={{ xs: 12, md: 2 }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                endIcon={<Clear />}
                fullWidth
                onClick={() => {
                  setQ("");
                  setCategory("");
                  setAvailable("all");

                  setLoading(true);
                  load().then(() => {
                    setLoading(false);
                  });
                }}
              >
                Clear
              </Button>
              <Button endIcon={<Search />} fullWidth variant="contained" onClick={load}>
                Search
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ width: "100%", mb: 2 }} />

        <Grid container spacing={2}>
          {loading && <CircularProgress />}
          {!loading && items.length === 0 && <Typography variant="body1">No items found</Typography>}
          {items.map((it) => (
            <Grid sx={{ xs: 12, md: 6, lg: 4 }} key={it.id}>
              <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 2, border: "1px solid #e0e0e0" }}>
                <CardContent>
                  <Typography variant="h6">{it.name}</Typography>
                  <Typography variant="body2">Category: {it.category}</Typography>
                  <Typography variant="body2">Condition: {it.condition}</Typography>
                  <Typography variant="body2">
                    Capacity: {it.availableQuantity}/{it.quantity}
                  </Typography>
                </CardContent>
                <CardActions>
                  {auth ? (
                    <RequestButton equipmentId={it.id} availableQuantity={it.availableQuantity} />
                  ) : (
                    <Typography sx={{ pl: 2 }} variant="caption">
                      Login to request
                    </Typography>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
