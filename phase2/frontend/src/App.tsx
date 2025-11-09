import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import EquipmentList from "./pages/EquipmentList";
import Login from "./pages/Login";
import AdminEquipment from "./pages/admin/Equipment";
import AdminRequests from "./pages/admin/Request";
import Requests from "./pages/Requests";
import Signup from "./pages/Signup.tsx";
import { Toaster } from "react-hot-toast";
import NavBar from "./components/Navbar.tsx";
import { useAuth } from "./contexts/AuthContext.tsx";

export default function App() {
  const { auth } = useAuth();

  const renderRoutes = () => {
    if (auth?.role === "STUDENT") {
      return <EquipmentList />;
    } else if (auth?.role === "ADMIN" || auth?.role === "STAFF") {
      return <AdminEquipment />;
    } else {
      return <EquipmentList />;
    }
  };

  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <NavBar />
      <Routes>
        <Route path="/" element={<ProtectedRoute>{renderRoutes()}</ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/requests"
          element={
            <ProtectedRoute roles={["STUDENT"]}>
              <Requests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/equipment"
          element={
            <ProtectedRoute roles={["ADMIN", "STAFF"]}>
              <AdminEquipment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute roles={["ADMIN", "STAFF"]}>
              <AdminRequests />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
