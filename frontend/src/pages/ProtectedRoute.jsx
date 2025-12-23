import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function ProtectedRoute({ children, role }) {
  const { user, token } = useAuthStore();

  // Pas connecté
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // Mauvais rôle
  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
}
