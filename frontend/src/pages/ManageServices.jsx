import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import Header from "../components/Header";

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: ""
  });

  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchServices();
  }, [token]);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services/me");
      setServices(res.data);
    } catch (err) {
      console.error("Erreur fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingService) {
        await api.put(`/services/${editingService._id}`, formData);
        alert("Service modifié");
      } else {
        await api.post("/services", formData);
        alert("Service créé");
      }

      setShowForm(false);
      setEditingService(null);
      setFormData({ title: "", description: "", price: "", duration: "" });
      fetchServices();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur");
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description || "",
      price: service.price,
      duration: service.duration
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      return;
    }

    try {
      await api.delete(`/services/${id}`);
      alert("Service supprimé");
      fetchServices();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
    setFormData({ title: "", description: "", price: "", duration: "" });
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
        <h2>Mes services</h2>

        {!showForm ? (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            Créer un service
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="form-card">
            <h3>{editingService ? "Modifier le service" : "Nouveau service"}</h3>

            <input
              type="text"
              placeholder="Titre"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              minLength={3}
            />

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Prix (€)"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
              min="0"
            />

            <input
              type="number"
              placeholder="Durée (minutes)"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              required
              min="1"
            />

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingService ? "Modifier" : "Créer"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {services.length === 0 ? (
          <p className="empty-state">Aucun service</p>
        ) : (
          <div className="services-list">
            {services.map((service) => (
              <div key={service._id} className="service-card">
                <h3>{service.title}</h3>
                {service.description && <p>{service.description}</p>}
                <p>
                  <strong>Prix:</strong> {service.price}€
                </p>
                <p>
                  <strong>Durée:</strong> {service.duration} minutes
                </p>
                <div className="card-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => handleEdit(service)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(service._id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

