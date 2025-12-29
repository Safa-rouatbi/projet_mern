import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import Header from "../components/Header";
import styles from "./BookAppointment.module.css"

export default function BookAppointment() {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchServices() {
      try {
        const res = await api.get("/services");

        // Grouper les services par provider
        const grouped = {};
        res.data.forEach((service) => {
          const pid = service.provider._id;

          if (!grouped[pid]) {
            grouped[pid] = {
              provider: service.provider,
              services: []
            };
          }

          grouped[pid].services.push(service);
        });

        setProviders(Object.values(grouped));
      } catch (err) {
        console.error("Erreur fetch services:", err);
      }
    }

    fetchServices();
  }, [token, navigate]);

  useEffect(() => {
    if (selectedProvider?.provider._id) {
      fetchProviderReviews(selectedProvider.provider._id);
    } else {
      setReviews([]);
    }
  }, [selectedProvider]);

  const fetchProviderReviews = async (providerId) => {
    try {
      const res = await api.get(`/reviews/provider/${providerId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Erreur fetch reviews:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProvider || !selectedService || !date) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      await api.post("/appointments", {
        provider: selectedProvider.provider._id,
        service: selectedService,
        date,
        notes: notes || ""
      });

      alert("Rendez-vous créé !");
      navigate("/client");
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de la création du rendez-vous");
    }
  };

  return (
    <div className={styles.page}>
    <div>
      <Header />
      <div className="container">
        <h2>Prendre un rendez-vous</h2>

        <form onSubmit={handleSubmit} className="form-card">
          <select
            value={selectedProvider?.provider._id || ""}
            onChange={(e) =>
              setSelectedProvider(
                providers.find((p) => p.provider._id === e.target.value)
              )
            }
            required
          >
            <option value="">Choisir un provider</option>
            {providers.map((p) => (
              <option key={p.provider._id} value={p.provider._id}>
                {p.provider.name}
              </option>
            ))}
          </select>

          {selectedProvider && (
            <>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                required
              >
                <option value="">Choisir un service</option>
                {selectedProvider.services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.title} – {s.price}€ ({s.duration} min)
                  </option>
                ))}
              </select>

              <div className="provider-info">
                <h4>{selectedProvider.provider.name}</h4>
                <div className="reviews-preview">
                  {reviews.length > 0 ? (
                    <>
                      <p>
                        <strong>Avis:</strong> {reviews.length} avis
                        {reviews.length > 0 && (
                          <span className="rating">
                            {"★".repeat(
                              Math.round(
                                reviews.reduce((sum, r) => sum + r.rating, 0) /
                                  reviews.length
                              )
                            )}
                          </span>
                        )}
                      </p>
                      <Link
                        to={`/reviews/${selectedProvider.provider._id}`}
                        className="link-reviews"
                      >
                        Voir tous les avis →
                      </Link>
                    </>
                  ) : (
                    <p>Aucun avis pour le moment</p>
                  )}
                </div>
              </div>
            </>
          )}

          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <textarea
            placeholder="Notes (optionnel)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button type="submit" className="btn-primary">
            Confirmer
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}
