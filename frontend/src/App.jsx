import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientDashboard from "./pages/ClientDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import BookAppointment from "./pages/BookAppointment";
import ManageServices from "./pages/ManageServices";
import Profile from "./pages/Profile";
import Reviews from "./pages/Reviews";

function App() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/client"
          element={
            user?.role === "client" ? (
              <ClientDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/provider"
          element={
            user?.role === "provider" ? (
              <ProviderDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/book"
          element={
            user?.role === "client" ? (
              <BookAppointment />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/services"
          element={
            user?.role === "provider" ? (
              <ManageServices />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />

        <Route
          path="/reviews/:providerId"
          element={<Reviews />}
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
