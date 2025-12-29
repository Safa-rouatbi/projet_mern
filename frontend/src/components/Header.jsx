import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <Link to={user.role === "client" ? "/client" : "/provider"}>
            <h3>RDV App</h3>
          </Link>
        </div>

        <div className="nav-right">
          {user.role === "client" && (
            <>
              <Link to="/client">Mes rendez-vous</Link>
              <Link to="/book">Prendre un RDV</Link>
              <Link to="/profile">Mon profil</Link>
            </>
          )}

          {user.role === "provider" && (
            <>
              <Link to="/provider">Mes rendez-vous</Link>
              <Link to="/services">Mes services</Link>
              <Link to="/profile">Mon profil</Link>
            </>
          )}

          <span className="user-name">{user.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Déconnexion
          </button>
        </div>
      </nav>
    </header>
  );
}

