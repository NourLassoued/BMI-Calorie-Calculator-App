import React, { useState, useEffect } from "react";
import DashboardMenu from "./DashboardMenu";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getPoidsByUser, addPoids, deletePoids } from "../../service/poids";

export default function PoidsPage() {
  const [poidsList, setPoidsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    poidsActuel: "",
    note: "",
  });

  useEffect(() => {
    fetchPoids();
  }, []);

  const fetchPoids = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const userId = decoded.id;

      const data = await getPoidsByUser(userId);
      const sorted = data.sort(
        (a, b) => new Date(b.dateMesure) - new Date(a.dateMesure)
      );

      setPoidsList(sorted);
    } catch (error) {
      console.error("Erreur récupération poids :", error);
      toast.error("Erreur lors de la récupération des poids");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === "number" ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Utilisateur non connecté");

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const userId = decoded.id;

      const newPoids = await addPoids(userId, formData);

      setPoidsList([newPoids, ...poidsList]);
      setFormData({ poidsActuel: "", note: "" });
      setShowModal(false);

      toast.success("⚖️ Poids ajouté avec succès");
    } catch (error) {
      console.error("Erreur ajout poids :", error);
      toast.error("Erreur lors de l'ajout");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette mesure ?")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Utilisateur non connecté");

      await deletePoids(id, token);
      setPoidsList(poidsList.filter((p) => p._id !== id));
      toast.success("Poids supprimé");
    } catch (error) {
      console.error("Erreur suppression poids :", error);
      toast.error("Erreur suppression");
    }
  };

  // Calculer la variation par rapport à la mesure précédente
  const getVariation = (currentIndex) => {
    if (currentIndex === poidsList.length - 1) return null; // Première mesure

    const current = poidsList[currentIndex].poidsActuel;
    const previous = poidsList[currentIndex + 1].poidsActuel;
    const diff = current - previous;

    return {
      value: Math.abs(diff).toFixed(1),
      type: diff > 0 ? "augmentation" : diff < 0 ? "diminution" : "stable",
    };
  };

  // Calculer les statistiques
  const stats = {
    poidsActuel: poidsList.length > 0 ? poidsList[0].poidsActuel : 0,
    poidsInitial: poidsList.length > 0 ? poidsList[poidsList.length - 1].poidsActuel : 0,
    variationTotale: poidsList.length > 0 ? (poidsList[0].poidsActuel - poidsList[poidsList.length - 1].poidsActuel).toFixed(1) : 0,
    nombreMesures: poidsList.length,
  };

  return (
    <div style={{ marginLeft: "280px", padding: "2rem", background: "#f5f5f5", minHeight: "100vh" }}>
      <DashboardMenu />
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* En-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: "#1f2937", marginBottom: "0.5rem" }}>⚖️ Suivi des Poids</h1>
            <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>Ajoutez et suivez vos mesures de poids dans le temps</p>
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
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(37, 99, 235, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
            }}
          >
            <span>➕</span>
            <span>Ajouter un poids</span>
          </button>
        </div>

        {/* Statistiques */}
        {poidsList.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
            <StatCard icon="⚖️" value={`${stats.poidsActuel} kg`} label="Poids actuel" color="#2563eb" bgColor="#eff6ff" />
            <StatCard icon="📊" value={`${stats.poidsInitial} kg`} label="Poids initial" color="#8b5cf6" bgColor="#f5f3ff" />
            <StatCard 
              icon={stats.variationTotale < 0 ? "📉" : stats.variationTotale > 0 ? "📈" : "➡️"} 
              value={`${stats.variationTotale > 0 ? '+' : ''}${stats.variationTotale} kg`} 
              label="Variation totale" 
              color={stats.variationTotale < 0 ? "#10b981" : stats.variationTotale > 0 ? "#ef4444" : "#6b7280"} 
              bgColor={stats.variationTotale < 0 ? "#f0fdf4" : stats.variationTotale > 0 ? "#fef2f2" : "#f9fafb"} 
            />
            <StatCard icon="📝" value={stats.nombreMesures} label="Mesures enregistrées" color="#f59e0b" bgColor="#fef3c7" />
          </div>
        )}

        {poidsList.length === 0 ? (
          <div style={{ background: "white", padding: "4rem 2rem", borderRadius: "10px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>⚖️</div>
            <h3 style={{ fontSize: "1.5rem", color: "#1f2937", marginBottom: "0.5rem" }}>Aucune mesure enregistrée</h3>
            <p style={{ color: "#6b7280", marginBottom: "2rem" }}>Commencez par ajouter votre poids actuel</p>
            <button onClick={() => setShowModal(true)} style={{ padding: "0.75rem 2rem", background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", color: "white", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer" }}>
              Ajouter un poids
            </button>
          </div>
        ) : (
          <div style={{ background: "white", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            {/* Table Header */}
            <div style={{ display: "grid", gridTemplateColumns: "140px 120px 1fr 150px 120px", padding: "1rem 1.5rem", background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)", borderBottom: "2px solid #e5e7eb", fontWeight: "600", color: "#374151", fontSize: "0.95rem" }}>
              <div>📅 Date</div>
              <div>⚖️ Poids</div>
              <div>📝 Note</div>
              <div>📊 Variation</div>
              <div style={{ textAlign: "center" }}>🔧 Actions</div>
            </div>

            {/* Table Body */}
            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
              {poidsList.map((p, index) => {
                const variation = getVariation(index);
                return (
                  <div
                    key={p._id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "140px 120px 1fr 150px 120px",
                      padding: "1rem 1.5rem",
                      borderBottom: "1px solid #e5e7eb",
                      transition: "all 0.2s ease",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                    }}
                  >
                    {/* Date */}
                    <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                      {new Date(p.dateMesure).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>

                    {/* Poids */}
                    <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1f2937" }}>
                      {p.poidsActuel} kg
                    </div>

                    {/* Note */}
                    <div style={{ fontSize: "0.9rem", color: "#6b7280", fontStyle: p.note ? "normal" : "italic" }}>
                      {p.note || "Aucune note"}
                    </div>

                    {/* Variation */}
                    <div>
                      {variation ? (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "20px",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                            background:
                              variation.type === "diminution"
                                ? "#f0fdf4"
                                : variation.type === "augmentation"
                                ? "#fef2f2"
                                : "#f9fafb",
                            color:
                              variation.type === "diminution"
                                ? "#10b981"
                                : variation.type === "augmentation"
                                ? "#ef4444"
                                : "#6b7280",
                          }}
                        >
                          <span style={{ fontSize: "1rem" }}>
                            {variation.type === "diminution" ? "📉" : variation.type === "augmentation" ? "📈" : "➡️"}
                          </span>
                          <span>
                            {variation.type === "diminution" ? "-" : variation.type === "augmentation" ? "+" : ""}
                            {variation.value} kg
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.85rem", color: "#9ca3af", fontStyle: "italic" }}>Première mesure</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                      <button
                        style={{
                          padding: "0.4rem 0.8rem",
                          background: "#f3f4f6",
                          color: "#374151",
                          border: "none",
                          borderRadius: "5px",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#e5e7eb";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#f3f4f6";
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        style={{
                          padding: "0.4rem 0.8rem",
                          background: "#fef2f2",
                          color: "#dc2626",
                          border: "none",
                          borderRadius: "5px",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#fee2e2";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#fef2f2";
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "10px", width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
              <h2 style={{ fontSize: "1.5rem", color: "#1f2937" }}>⚖️ Ajouter un poids</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#6b7280" }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ padding: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>Poids (kg)</label>
                <input
                  type="number"
                  name="poidsActuel"
                  value={formData.poidsActuel}
                  onChange={handleInputChange}
                  required
                  placeholder="85"
                  step="0.1"
                  style={{ width: "100%", padding: "0.75rem", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "1rem" }}
                />

                <label style={{ display: "block", marginTop: "1rem", marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>Note (facultatif)</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Ex: Après le sport, à jeun..."
                  rows="3"
                  style={{ width: "100%", padding: "0.75rem", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "1rem", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", padding: "1.5rem", borderTop: "1px solid #e5e7eb" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: "0.75rem", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                  Annuler
                </button>
                <button type="submit" style={{ flex: 1, padding: "0.75rem", background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                  Ajouter
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
        <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#1f2937" }}>{value}</div>
        <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>{label}</div>
      </div>
    </div>
  );
}