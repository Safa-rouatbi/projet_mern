import { useEffect, useState } from "react";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function CreateAppointment() {
  const [groupedServices, setGroupedServices] = useState({});
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const token = useAuthStore(state => state.token);
  const navigate = useNavigate();

  // 🔹 Charger & grouper les services
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await api.get("/services");

        const grouped = {};
        res.data.forEach(service => {
          const providerId = service.provider._id;

          if (!grouped[providerId]) {
            grouped[providerId] = {
              providerName: service.provider.name,
              services: []
            };
          }

          grouped[providerId].services.push(service);
        });

        setGroupedServices(grouped);
      } catch (err) {
        console.error("Erreur chargement services", err);
      }
    }

    fetchServices();
  }, []);

  // 🔹 Soumission RDV
  const handleSubmit = async (e) => {
    e.preventDefault();

    // retrouver le service choisi
    const allServices = Object.values(groupedServices)
      .flatMap(p => p.services);

    const selectedService = allServices.find(s => s._id === serviceId);

    try {
      await api.post(
        "/appointments",
        {
          provider: selectedService.provider._id,
          service: serviceId,
          date,
          notes
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate("/client");
    } catch (err) {
      console.error("Erreur création RDV", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Prendre un rendez-vous</h2>

      {/* 🔽 MENU DÉROULANT GROUPÉ */}
      <select
        value={serviceId}
        onChange={(e) => setServiceId(e.target.value)}
        required
      >
        <option value="">-- Choisir un service --</option>

        {Object.entries(groupedServices).map(([providerId, group]) => (
          <optgroup
            key={providerId}
            label={group.providerName}
          >
            {group.services.map(service => (
              <option key={service._id} value={service._id}>
                {service.title} – {service.price}€
              </option>
            ))}
          </optgroup>
        ))}
      </select>

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

      <button>Créer le rendez-vous</button>
    </form>
  );
}
