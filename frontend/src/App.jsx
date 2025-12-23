import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientDashboard from "./pages/ClientDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import BookAppointment from "./pages/BookAppointment";

function App() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <div>Chargement...</div>; // ⏳
  }

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/client"
          element={
            user?.role === "client"
              ? <ClientDashboard />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/provider"
          element={
            user?.role === "provider"
              ? <ProviderDashboard />
              : <Navigate to="/login" />
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />

        <Route
  path="/book"
  element={
    user?.role === "client"
      ? <BookAppointment />
      : <Navigate to="/login" />
  }
/>

      </Routes>
    </BrowserRouter>
  );
}


export default App;
