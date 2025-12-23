import { useEffect, useState } from "react";
import api from "../services/api";
import useAuthStore from "../store/authStore";

export default function BookAppointment() {
  const token = useAuthStore(state => state.token);

  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    async function fetchServices() {
      if (!token) return;

      try {
        const res = await api.get("/services", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Grouper les services par provider
        const grouped = {};
        res.data.forEach(service => {
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
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProvider || !selectedService || !date) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      await api.post(
        "/appointments",
        {
          provider: selectedProvider.provider._id,
          service: selectedService,
          date
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Rendez-vous créé !");
      setSelectedProvider(null);
      setSelectedService("");
      setDate("");
    } catch (err) {
      console.error("Erreur création rendez-vous:", err);
      alert("Erreur lors de la création du rendez-vous");
    }
  };

  return (
    <div>
      <h2>Prendre un rendez-vous</h2>

      <form onSubmit={handleSubmit}>
        {/* PROVIDER */}
        <select
          value={selectedProvider?.provider._id || ""}
          onChange={(e) =>
            setSelectedProvider(
              providers.find(p => p.provider._id === e.target.value)
            )
          }
        >
          <option value="">Choisir un provider</option>
          {providers.map(p => (
            <option key={p.provider._id} value={p.provider._id}>
              {p.provider.name}
            </option>
          ))}
        </select>

        {/* SERVICES */}
        {selectedProvider && (
          <select
            value={selectedService}
            onChange={e => setSelectedService(e.target.value)}
          >
            <option value="">Choisir un service</option>
            {selectedProvider.services.map(s => (
              <option key={s._id} value={s._id}>
                {s.title} – {s.price}€
              </option>
            ))}
          </select>
        )}

        {/* DATE */}
        <input
          type="datetime-local"
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        <button type="submit">Confirmer</button>
      </form>
    </div>
  );
}
