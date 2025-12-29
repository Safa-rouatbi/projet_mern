import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import Header from "../components/Header";
import styles from "./Profile.module.css"

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    bio: "",
    phone: "",
    address: ""
  });

  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile/me");
      setProfile(res.data);
      setFormData({
        bio: res.data.bio || "",
        phone: res.data.phone || "",
        address: res.data.address || ""
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setProfile(null);
      } else {
        console.error("Erreur fetch profile:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (profile) {
        await api.put("/profile", formData);
        alert("Profil modifié");
      } else {
        await api.post("/profile", formData);
        alert("Profil créé");
      }
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre profil ?")) {
      return;
    }

    try {
      await api.delete("/profile");
      alert("Profil supprimé");
      setProfile(null);
      setFormData({ bio: "", phone: "", address: "" });
    } catch (err) {
      alert(err.response?.data?.error || "Erreur");
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
        <h2>Mon profil</h2>

        {!profile && !isEditing && (
          <button className="btn-primary" onClick={() => setIsEditing(true)}>
            Créer mon profil
          </button>
        )}

        {profile && !isEditing && (
          <div className="profile-card">
            {profile.avatar && (
              <img src={profile.avatar} alt="Avatar" className="avatar" />
            )}
            {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}
            {profile.phone && <p><strong>Téléphone:</strong> {profile.phone}</p>}
            {profile.address && <p><strong>Adresse:</strong> {profile.address}</p>}
            <div className="card-actions">
              <button
                className="btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Modifier
              </button>
              <button className="btn-danger" onClick={handleDelete}>
                Supprimer
              </button>
            </div>
          </div>
        )}

        {isEditing && (
          <form onSubmit={handleSubmit} className="form-card">
            <h3>{profile ? "Modifier le profil" : "Créer le profil"}</h3>

            <textarea
              placeholder="Bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Adresse"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {profile ? "Modifier" : "Créer"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  if (profile) {
                    setFormData({
                      bio: profile.bio || "",
                      phone: profile.phone || "",
                      address: profile.address || ""
                    });
                  }
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

