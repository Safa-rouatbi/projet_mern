import { useEffect, useState } from "react";
import api from "../services/api";
import useAuthStore from "../store/authStore"; // Zustand store

export default function ClientDashboard() {
  const [appointments, setAppointments] = useState([]);

  // Récupérer le token depuis Zustand
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    async function fetchAppointments() {
      if (!token) return; // sécurité

      try {
        const res = await api.get("/appointments", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setAppointments(res.data);
      } catch (err) {
        console.error("Erreur fetch appointments:", err);
      }
    }

    fetchAppointments();
  }, [token]);

  return (
    <div>
      <h2>Mes rendez-vous</h2>

      {appointments.length === 0 ? (
        <p>Aucun rendez-vous</p>
      ) : (
        appointments.map(a => (
          <div key={a._id}>
            {new Date(a.date).toLocaleString()} – {a.provider.name}
          </div>
        ))
      )}
    </div>
  );
}
