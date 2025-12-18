"use client";

import { useState, useEffect } from "react";
import DashboardMenu from "./DashboardMenu";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getObjectifById,
  deleteObjectif,
  updateSatutObjectif,
} from "../../service/object";

export default function ObjectifsPage() {
  const [objectifs, setObjectifs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    poidsDepart: "",
    poidsCible: "",
    rythemeKgparSemaine: 0.5,
    typeObjectif: "perte",
  });

  useEffect(() => {
    fetchObjectifs();
  }, []);

  const fetchObjectifs = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const userId = decoded.id;

      const data = await getObjectifById(userId);
      setObjectifs(data);
    } catch (error) {
      console.error("Erreur récupération objectifs :", error);
    }
  };

  const handleInputChange = (e) => {
    const value =
      e.target.type === "number" || e.target.type === "range"
        ? Number.parseFloat(e.target.value)
        : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Utilisateur non connecté");

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const userId = decoded.id;

      const response = await fetch(
        "http://localhost:5000/objectifs/addObjectif",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            utilisateur: userId,
          }),
        }
      );

      if (response.ok) {
        const newObjectif = await response.json();
        setObjectifs([...objectifs, newObjectif]);
        setShowModal(false);
        setFormData({
          poidsDepart: "",
          poidsCible: "",
          rythemeKgparSemaine: 0.5,
          typeObjectif: "perte",
        });
        toast.success("Objectif ajouté avec succès");
      } else {
        const error = await response.json();
        alert(error.message || "Erreur lors de la création de l'objectif");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la création");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Utilisateur non connecté");

      await deleteObjectif(id, token);
      setObjectifs(objectifs.filter((obj) => obj._id !== id));
      toast.success("Objectif supprimé");
    } catch (error) {
      console.error("Erreur suppression objectif :", error);
      toast.error("Erreur suppression");
    }
  };

  const handleSetAttente = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Utilisateur non connecté");

      const updatedObjectif = await updateSatutObjectif(
        id,
        {
          statut: "atteint",
        },
        token
      );

      setObjectifs((prev) =>
        prev.map((o) => (o._id === id ? updatedObjectif : o))
      );
      toast.success("Objectif atteint !");
    } catch (error) {
      console.error("Erreur mise à jour objectif:", error);
      toast.error("Erreur mise à jour statut");
    }
  };

  const calculateDaysRemaining = (dateDebut, dateFin) => {
    const today = new Date();
    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const totalDays =
      Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    if (today < startDate) return totalDays;

    const daysPassed =
      Math.round((today - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const daysLeft = totalDays - daysPassed;
    return daysLeft > 0 ? daysLeft : 0;
  };

  const calculateProgression = (dateDebut, dateFin) => {
    const today = new Date();
    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const totalDays =
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const daysPassed =
      today < startDate
        ? 0
        : Math.min(
            Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1,
            totalDays
          );

    const progression = (daysPassed / totalDays) * 100;
    return progression > 100 ? 100 : Math.round(progression);
  };

  const getObjectifIcon = (type) => {
    switch (type) {
      case "perte":
        return "🔽";
      case "gain":
        return "🔼";
      case "maintien":
        return "➡️";
      default:
        return "🎯";
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case "actif":
        return "#2563eb";
      case "atteint":
        return "#10b981";
      case "abandonne":
        return "#ef4444";
      case "expire":
        return "#6b7280";
      default:
        return "#2563eb";
    }
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case "actif":
        return "En cours";
      case "atteint":
        return "Atteint";
      case "abandonne":
        return "Abandonné";
      case "expire":
        return "Expiré";
      default:
        return statut;
    }
  };

  return (
    <div
      style={{
        marginLeft: "280px",
        padding: "2rem",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <DashboardMenu />
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "0.5rem",
              }}
            >
              Mes Objectifs
            </h1>
            <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>
              Suivez vos objectifs de fitness et mesurez votre progression
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(37, 99, 235, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(37, 99, 235, 0.3)";
            }}
          >
            <span>+</span>
            <span>Nouvel Objectif</span>
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <StatCard
            icon="📊"
            value={objectifs.filter((o) => o.statut === "actif").length}
            label="Objectifs actifs"
            color="#2563eb"
            bgColor="#eff6ff"
          />
          <StatCard
            icon="✅"
            value={objectifs.filter((o) => o.statut === "atteint").length}
            label="Objectifs atteints"
            color="#10b981"
            bgColor="#f0fdf4"
          />
          <StatCard
            icon="🎯"
            value={objectifs.length}
            label="Total objectifs"
            color="#ef4444"
            bgColor="#fef2f2"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {objectifs.map((objectif) => (
            <ObjectifCard
              key={objectif._id}
              objectif={objectif}
              getObjectifIcon={getObjectifIcon}
              getStatutColor={getStatutColor}
              getStatutLabel={getStatutLabel}
              calculateDaysRemaining={calculateDaysRemaining}
              calculateProgression={calculateProgression}
              onDelete={handleDelete}
              onSetAttente={handleSetAttente}
            />
          ))}
        </div>

        {objectifs.length === 0 && (
          <div
            style={{
              background: "white",
              padding: "4rem 2rem",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🎯</div>
            <h3
              style={{
                fontSize: "1.5rem",
                color: "#1f2937",
                marginBottom: "0.5rem",
              }}
            >
              Aucun objectif défini
            </h3>
            <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
              Commencez par créer votre premier objectif de fitness
            </p>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: "0.75rem 2rem",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Créer un objectif
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.5rem",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <h2 style={{ fontSize: "1.5rem", color: "#1f2937" }}>
                Nouvel Objectif
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ padding: "1.5rem" }}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Type d'objectif
                  </label>
                  <select
                    name="typeObjectif"
                    value={formData.typeObjectif}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "1rem",
                    }}
                  >
                    <option value="perte">Perte de poids</option>
                    <option value="gain">Gain de poids</option>
                    <option value="maintien">Maintien du poids</option>
                  </select>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "600",
                        color: "#374151",
                      }}
                    >
                      Poids actuel (kg)
                    </label>
                    <input
                      type="number"
                      name="poidsDepart"
                      value={formData.poidsDepart}
                      onChange={handleInputChange}
                      placeholder="85"
                      step="0.1"
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "1rem",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "600",
                        color: "#374151",
                      }}
                    >
                      Poids cible (kg)
                    </label>
                    <input
                      type="number"
                      name="poidsCible"
                      value={formData.poidsCible}
                      onChange={handleInputChange}
                      placeholder="75"
                      step="0.1"
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "1rem",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "1rem",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Rythme de progression:{" "}
                    <span style={{ color: "#2563eb", fontSize: "1.1rem" }}>
                      {formData.rythemeKgparSemaine} kg/semaine
                    </span>
                  </label>

                  <div style={{ position: "relative" }}>
                    <input
                      type="range"
                      name="rythemeKgparSemaine"
                      min="0.1"
                      max="2"
                      step="0.1"
                      value={formData.rythemeKgparSemaine}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        height: "8px",
                        borderRadius: "5px",
                        background: `linear-gradient(to right, #2563eb 0%, #2563eb ${
                          ((formData.rythemeKgparSemaine - 0.1) / 1.9) * 100
                        }%, #e5e7eb ${
                          ((formData.rythemeKgparSemaine - 0.1) / 1.9) * 100
                        }%, #e5e7eb 100%)`,
                        outline: "none",
                        cursor: "pointer",
                        WebkitAppearance: "none",
                        appearance: "none",
                      }}
                    />
                    <style>{`
                      input[type="range"]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        background: #2563eb;
                        cursor: pointer;
                        border: 3px solid white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                      }
                      input[type="range"]::-moz-range-thumb {
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        background: #2563eb;
                        cursor: pointer;
                        border: 3px solid white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                      }
                    `}</style>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "0.5rem",
                      fontSize: "0.85rem",
                      color: "#6b7280",
                    }}
                  >
                    <span>🐌 Lent (0.1 kg)</span>
                    <span>⚡ Rapide (2 kg)</span>
                  </div>

                  {formData.poidsDepart &&
                    formData.poidsCible &&
                    formData.rythemeKgparSemaine && (
                      <div
                        style={{
                          marginTop: "1rem",
                          padding: "1rem",
                          background: "#eff6ff",
                          borderRadius: "8px",
                          border: "1px solid #bfdbfe",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <span style={{ fontSize: "1.2rem" }}>📊</span>
                          <span style={{ fontWeight: "600", color: "#1e40af" }}>
                            Estimation:
                          </span>
                        </div>
                        <div style={{ fontSize: "0.9rem", color: "#1e3a8a" }}>
                          <div>
                            Différence:{" "}
                            {Math.abs(
                              formData.poidsCible - formData.poidsDepart
                            ).toFixed(1)}{" "}
                            kg
                          </div>
                          <div>
                            Durée:{" "}
                            {Math.ceil(
                              Math.abs(
                                formData.poidsCible - formData.poidsDepart
                              ) / formData.rythemeKgparSemaine
                            )}{" "}
                            semaines
                          </div>
                          <div>
                            Date d'arrivée estimée:{" "}
                            {new Date(
                              Date.now() +
                                Math.ceil(
                                  Math.abs(
                                    formData.poidsCible - formData.poidsDepart
                                  ) / formData.rythemeKgparSemaine
                                ) *
                                  7 *
                                  24 *
                                  60 *
                                  60 *
                                  1000
                            ).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  padding: "1.5rem",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#f3f4f6",
                    color: "#374151",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Créer l'objectif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, value, label, color, bgColor }) {
  return (
    <div
      style={{
        background: "white",
        padding: "1.5rem",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "12px",
          background: bgColor,
          color: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.8rem",
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "2rem", fontWeight: "700", color: "#1f2937" }}>
          {value}
        </div>
        <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>{label}</div>
      </div>
    </div>
  );
}

function ObjectifCard({
  objectif,
  getObjectifIcon,
  getStatutColor,
  getStatutLabel,
  calculateDaysRemaining,
  calculateProgression,
  onDelete,
  onSetAttente,
}) {
  const progressionPercentage = calculateProgression(
    objectif.dateDebut,
    objectif.dateFinCible
  );

  return (
    <div
      style={{
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      }}
    >
      <div
        style={{
          padding: "1.5rem",
          background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.5rem" }}>
            {getObjectifIcon(objectif.typeObjectif)}
          </span>
          <span style={{ fontWeight: "600", color: "#1f2937" }}>
            {objectif.typeObjectif.charAt(0).toUpperCase() +
              objectif.typeObjectif.slice(1)}{" "}
            de poids
          </span>
        </div>
        <span
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "20px",
            color: "white",
            fontSize: "0.85rem",
            fontWeight: "600",
            background: getStatutColor(objectif.statut),
          }}
        >
          {getStatutLabel(objectif.statut)}
        </span>
      </div>

      <div style={{ padding: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#f9fafb",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                color: "#6b7280",
                marginBottom: "0.25rem",
              }}
            >
              Départ
            </span>
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#1f2937",
              }}
            >
              {objectif.poidsDepart} kg
            </span>
          </div>
          <div style={{ fontSize: "1.5rem", color: "#2563eb" }}>→</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                color: "#6b7280",
                marginBottom: "0.25rem",
              }}
            >
              Cible
            </span>
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#2563eb",
              }}
            >
              {objectif.poidsCible} kg
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.9rem",
              color: "#6b7280",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>📅</span>
            <span>
              Début: {new Date(objectif.dateDebut).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.9rem",
              color: "#6b7280",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>🏁</span>
            <span>
              Fin: {new Date(objectif.dateFinCible).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>

        {objectif.statut === "actif" && (
          <>
            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  color: "#6b7280",
                }}
              >
                <span>Progression</span>
                <span style={{ fontWeight: "600", color: "#2563eb" }}>
                  {progressionPercentage}%
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: "#e5e7eb",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressionPercentage}%`,
                    background:
                      "linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)",
                    borderRadius: "10px",
                    transition: "width 1s ease",
                  }}
                ></div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem",
                background: "#fef3c7",
                borderRadius: "8px",
                color: "#92400e",
                fontWeight: "500",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>⏰</span>
              <span>
                {calculateDaysRemaining(
                  objectif.dateDebut,
                  objectif.dateFinCible
                )}{" "}
                jours restants
              </span>
            </div>
          </>
        )}
      </div>

      <div
        style={{
          padding: "1rem 1.5rem",
          background: "#f9fafb",
          display: "flex",
          gap: "0.5rem",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        {objectif.statut !== "atteint" && (
          <>
            <button
              style={{
                flex: 1,
                padding: "0.5rem 1rem",
                background: "#f3f4f6",
                color: "#374151",
                border: "none",
                borderRadius: "5px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Modifier
            </button>
            <button
              onClick={() => onSetAttente(objectif._id)}
              style={{
                flex: 1,
                padding: "0.5rem 1rem",
                background: "#f0fdf4",
                color: "#10b981",
                border: "none",
                borderRadius: "5px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              ✅ Atteint{" "}
            </button>
          </>
        )}
        <button
          onClick={() => onDelete(objectif._id)}
          style={{
            flex: 1,
            padding: "0.5rem 1rem",
            background: "#fef2f2",
            color: "#dc2626",
            border: "none",
            borderRadius: "5px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          🗑️ Supprimer
        </button>
      </div>
    </div>
  );
}
