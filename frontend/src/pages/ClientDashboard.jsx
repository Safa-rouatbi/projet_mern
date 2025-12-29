import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import Header from "../components/Header";

export default function ClientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    async function fetchAppointments() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/appointments");
        setAppointments(res.data);
      } catch (err) {
        console.error("Erreur fetch appointments:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [token]);

  const handleCancel = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
      return;
    }

    try {
      await api.put(`/appointments/cancel/${id}`);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "cancelled" } : a))
      );
      alert("Rendez-vous annulé");
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de l'annulation");
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container">
        <h2>Mes rendez-vous</h2>

        <button
          className="btn-primary"
          onClick={() => navigate("/book")}
        >
          Prendre un rendez-vous
        </button>

        {appointments.length === 0 ? (
          <p className="empty-state">Aucun rendez-vous</p>
        ) : (
          <div className="appointments-list">
            {appointments.map((a) => (
              <div key={a._id} className="appointment-card">
                <div className="appointment-header">
                  <h3>{a.service?.title || "Service"}</h3>
                  <span className={`status status-${a.status}`}>
                    {a.status}
                  </span>
                </div>
                <p>
                  <strong>Provider:</strong> {a.provider?.name}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(a.date).toLocaleString("fr-FR")}
                </p>
                {a.service && (
                  <p>
                    <strong>Prix:</strong> {a.service.price}€
                  </p>
                )}
                {a.notes && (
                  <p>
                    <strong>Notes:</strong> {a.notes}
                  </p>
                )}
                <div className="card-actions">
                  {a.status !== "cancelled" && (
                    <button
                      className="btn-danger"
                      onClick={() => handleCancel(a._id)}
                    >
                      Annuler
                    </button>
                  )}
                  {a.provider?._id && (
                    <Link
                      to={`/reviews/${a.provider._id}`}
                      className="btn-secondary"
                      style={{ textDecoration: "none", display: "inline-block" }}
                    >
                      Voir les avis
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
