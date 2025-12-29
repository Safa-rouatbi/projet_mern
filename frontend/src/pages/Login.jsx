import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      login(res.data);

      if (res.data.user.role === "client") {
        navigate("/client");
      } else {
        navigate("/provider");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Erreur de connexion");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Connexion</h2>

        {error && <div className="error">{error}</div>}

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
        />

        <button type="submit">Connexion</button>

        <p>
          Pas de compte ? <a href="/register">S'inscrire</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
