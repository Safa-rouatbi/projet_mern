import { useEffect, useState } from "react";
import api from "../services/api";
import useAuthStore from "../store/authStore";

export default function ProviderDashboard() {
  const [appointments, setAppointments] = useState([]);
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await api.get("/appointments/provider", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
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
          <div key={a._id} style={{ border: "1px solid #ccc", margin: 10 }}>
            <p><strong>Date :</strong> {new Date(a.date).toLocaleString()}</p>
            <p><strong>Client :</strong> {a.client.name}</p>
            <p><strong>Service :</strong> {a.service?.title}</p>
            <p><strong>Statut :</strong> {a.status}</p>
          </div>
        ))
      )}
    </div>
  );
}
