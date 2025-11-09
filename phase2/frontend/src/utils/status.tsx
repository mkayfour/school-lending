import { Chip } from "@mui/material";
import { CheckCircle, HourglassBottom, Cancel, Undo } from "@mui/icons-material";
import type { Status } from "../types/types";

export function toCanonicalStatus(input: string): Status {
  const s = (input || "").toUpperCase();
  if (s === "PENDING" || s === "PENDING_APPROVAL" || s === "REQUEST") return "REQUESTED";
  if (s === "DENIED") return "REJECTED";
  if (s === "APPROVED") return "APPROVED";
  if (s === "RETURNED") return "RETURNED";
  if (s === "REJECTED") return "REJECTED";
  // default to REQUESTED if unknown to keep flows working
  return "REQUESTED";
}

export function StatusChip({ status }: { status: string }) {
  const canonical = toCanonicalStatus(status);
  switch (canonical) {
    case "APPROVED":
      return (
        <Chip
          icon={<CheckCircle sx={{ fontSize: 18 }} />}
          label="Approved"
          color="success"
          size="small"
          sx={{ fontWeight: 600, fontSize: "0.97em", px: 0.8, minWidth: 92, letterSpacing: 0.13 }}
        />
      );
    case "REQUESTED":
      return (
        <Chip
          icon={<HourglassBottom sx={{ fontSize: 18 }} />}
          label="Requested"
          color="warning"
          size="small"
          sx={{ fontWeight: 600, fontSize: "0.97em", px: 0.8, minWidth: 92, letterSpacing: 0.13 }}
          variant="filled"
        />
      );
    case "REJECTED":
      return (
        <Chip
          icon={<Cancel sx={{ fontSize: 18 }} />}
          label="Rejected"
          color="error"
          size="small"
          sx={{ fontWeight: 600, fontSize: "0.97em", px: 0.8, minWidth: 92, letterSpacing: 0.13 }}
        />
      );
    case "RETURNED":
    default:
      return (
        <Chip
          icon={<Undo sx={{ fontSize: 18 }} />}
          label="Returned"
          color="info"
          size="small"
          sx={{ fontWeight: 600, fontSize: "0.97em", px: 0.8, minWidth: 92, letterSpacing: 0.13 }}
          variant="outlined"
        />
      );
  }
}

