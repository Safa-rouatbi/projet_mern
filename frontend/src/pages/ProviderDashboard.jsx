import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import Header from "../components/Header";
import styles from "./ProviderDashboard.module.css"; // CSS Module

export default function ProviderDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    async function fetchAppointments() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/appointments/provider");
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
    if (user?.id || user?._id) {
      fetchMyReviews();
    }
  }, [token, user]);

  const fetchMyReviews = async () => {
    try {
      const providerId = user?.id || user?._id;
      if (providerId) {
        const res = await api.get(`/reviews/provider/${providerId}`);
        setReviews(res.data);
      }
    } catch (err) {
      console.error("Erreur fetch reviews:", err);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.container}>Chargement...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <h2>Mes rendez-vous</h2>
          {(user?.id || user?._id) && (
            <Link
              to={`/reviews/${user.id || user._id}`}
              className={styles["btn-secondary"]}
            >
              Voir mes avis ({reviews.length})
            </Link>
          )}
        </div>

        {appointments.length === 0 ? (
          <p className={styles["empty-state"]}>Aucun rendez-vous</p>
        ) : (
          <div className={styles["appointments-list"]}>
            {appointments.map((a) => (
              <div key={a._id} className={styles["appointment-card"]}>
                <div className={styles["appointment-header"]}>
                  <h3>{a.service?.title || "Service"}</h3>
                  <span
                    className={`${styles.status} ${styles[`status-${a.status}`]}`}
                  >
                    {a.status}
                  </span>
                </div>
                <p>
                  <strong>Client:</strong> {a.client?.name}
                </p>
                <p>
                  <strong>Email:</strong> {a.client?.email}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(a.date).toLocaleString("fr-FR")}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
