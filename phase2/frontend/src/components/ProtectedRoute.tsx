import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Array<"STUDENT" | "STAFF" | "ADMIN">;
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { auth } = useAuth();

  if (!auth) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(auth.role)) return <Navigate to="/" replace />;

  return <>{children}</>;
}
