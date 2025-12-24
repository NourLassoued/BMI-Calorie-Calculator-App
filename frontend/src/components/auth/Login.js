import React from "react";
import { login } from "../../service/apiAuthUser";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Login.css";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [motDePasse, setMotDePasse] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({ email, motDePasse });

      console.log("Connecté :", res.user);

      localStorage.setItem("authToken", res.token);

      if (res.user.role === "admin") {
        navigate("/CoachDashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🏋️ FitTracker</h1>
          
        </div>

        <div className="auth-body">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Mot de passe <span className="required">*</span>
              </label>
              <input
                type="password"
                className="form-input"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="auth-footer">
            Pas encore de compte ?{" "}
            <Link to="/Inscription">Inscrivez-vous</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
