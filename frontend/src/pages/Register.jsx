import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import styles from "./Register.module.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role
      });

      // Auto-login après inscription
      if (res.data.user) {
        // Il faut récupérer le token depuis le login
        // Pour l'instant, on redirige vers login
        alert("Inscription réussie ! Veuillez vous connecter.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Inscription</h2>

        {error && <div className={styles.error}>{error}</div>}

        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={3}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="client">Client</option>
          <option value="provider">Provider</option>
        </select>

        <button type="submit">S'inscrire</button>

        <p>
          Déjà un compte ? <a href="/login">Se connecter</a>
        </p>
      </form>
    </div>
  );
}