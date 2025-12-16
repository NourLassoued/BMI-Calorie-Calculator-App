import React, { useState } from "react";
import "../../styles/Register.css";
import { register } from "../../service/apiAuthUser";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";

export default function Inscriptionn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    dateNaissance: "",
    sexe: "", // homme, femme, autre
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    let tempErrors = {};
    if (!formData.nom) tempErrors.nom = "Nom requis";
    if (!formData.email) tempErrors.email = "Email requis";
    if (!formData.motDePasse) tempErrors.motDePasse = "Mot de passe requis";
    if (!formData.sexe) tempErrors.sexe = "Veuillez sélectionner votre sexe";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await register(formData); // appel API
      setSuccess("Compte créé avec succès !");
      setLoading(false);

      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setLoading(false);
      if (err.response?.data?.message) {
        setErrors({ api: err.response.data.message });
      } else {
        setErrors({ api: "Erreur serveur, réessayez plus tard." });
      }
    }
  };

  return (
    <div className="register-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🛍️ ShopX</h1>
          <p>Créer un compte</p>
        </div>

        <div className="auth-body">
          {success && <div className="alert alert-success">{success}</div>}
          {errors.api && <div className="alert alert-danger">{errors.api}</div>}

          <form onSubmit={handleSubmit}>
            {/* NOM */}
            <div className="form-group">
              <label className="form-label">Nom <span className="required">*</span></label>
              <input type="text" className="form-input" name="nom" value={formData.nom} onChange={handleChange} />
              {errors.nom && <div className="error-message">{errors.nom}</div>}
            </div>

            {/* PRENOM */}
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input type="text" className="form-input" name="prenom" value={formData.prenom} onChange={handleChange} />
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label className="form-label">Email <span className="required">*</span></label>
              <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label className="form-label">Mot de passe <span className="required">*</span></label>
              <input type="password" className="form-input" name="motDePasse" value={formData.motDePasse} onChange={handleChange} />
              {errors.motDePasse && <div className="error-message">{errors.motDePasse}</div>}
            </div>

            {/* DATE DE NAISSANCE */}
            <div className="form-group">
              <label className="form-label">Date de naissance</label>
              <input type="date" className="form-input" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} />
            </div>

            {/* SEXE */}
            <div className="form-group">
              <label className="form-label">Sexe <span className="required">*</span></label>
              <select name="sexe" className="form-input" value={formData.sexe} onChange={handleChange}>
                <option value="">Sélectionner</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="autre">Autre</option>
              </select>
              {errors.sexe && <div className="error-message">{errors.sexe}</div>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Chargement..." : "Créer mon compte"}
            </button>
          </form>

          <div className="divider"><span>OU</span></div>

          <button className="btn btn-google"><span>G</span> S'inscrire avec Google</button>
        </div>

        <div className="auth-footer">
          Déjà un compte ? <a href="/login">Connectez-vous</a>
        </div>
      </div>
    </div>
  );
}
