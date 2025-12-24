import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardMenu from "./DashboardMenu";
import BodyVisualizerUSNavy from "./BodyVisualizerUSNavy";
import ContactCoachModal from './ContactCoachModal';
export default function MesureMasseGrasse() {
  const [loading, setLoading] = useState(false);
  const [bodyFat, setBodyFat] = useState(null);
  const [sexe, setSexe] = useState(null);
  const [userId, setUserId] = useState(null);

  // Mesures US Navy
  const [mesures, setMesures] = useState({
    cou: "",
    taille: "",
    hanches: "",
    hauteur: ""
  });

  const [dateMesure, setDateMesure] = useState(new Date().toISOString().split("T")[0]);

  // Récupération des infos utilisateur et dernière mesure
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const id = decoded.id;
      setUserId(id);
      if (!id) return;

      // Récupération des infos utilisateur
      fetch(`http://localhost:5000/users/getUserById/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.sexe) setSexe(data.sexe);
          if (data.taille) {
            setMesures(prev => ({ ...prev, hauteur: data.taille }));
          }
        })
        .catch(err => console.error("Erreur récupération utilisateur :", err));

      // Récupérer la dernière mesure
      fetchLastMeasure(id);
    } catch (err) {
      console.error("Token invalide", err);
    }
  }, []);

  const fetchLastMeasure = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:5000/mesures/getDerniereMesure/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setBodyFat(data.pourcentageMasseGrasse);
          setMesures({
            cou: data.cou || "",
            taille: data.taille || "",
            hanches: data.hanches || "",
            hauteur: data.hauteur || ""
          });
        }
      }
    } catch (err) {
      console.log("Nouvel utilisateur ou erreur serveur :", err);
    }
  };

  const handleInputChange = (field, value) => {
    // Validation : nombres positifs avec max 1 décimale
    if (value === "" || /^\d*\.?\d{0,1}$/.test(value)) {
      setMesures({ ...mesures, [field]: value });
    }
  };

  const handleSubmit = async () => {
    console.group("🧪 DEBUG handleSubmit US Navy");
    console.log("🔹 sexe :", sexe);
    console.log("🔹 mesures :", mesures);

    // Validation selon le sexe
    if (!mesures.cou || !mesures.taille || !mesures.hauteur) {
      toast.error("❌ Tour de cou, taille et hauteur sont requis");
      return;
    }

    if (sexe === "femme" && !mesures.hanches) {
      toast.error("❌ Tour de hanches requis pour les femmes");
      return;
    }

    if (!sexe) {
      toast.error("Informations utilisateur incomplètes");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error(" Utilisateur non authentifié");
        setLoading(false);
        return;
      }

      const payload = {
        cou: Number(mesures.cou),
        taille: Number(mesures.taille),
        hanches: Number(mesures.hanches) || 0,
        hauteur: Number(mesures.hauteur),
        dateMesure
      };

      console.log("📦 Payload envoyé :", payload);

      const res = await fetch(`http://localhost:5000/mesures/addMesure/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Erreur serveur");
      }

      const data = await res.json();
      toast.success(
        ` Masse grasse enregistrée : ${data.pourcentageMasseGrasse}%\n` +
        ` Méthode : US Navy (${sexe})`,
        { autoClose: 5000 }
      );

      setBodyFat(data.pourcentageMasseGrasse);

    } catch (err) {
      console.error("❌ ERREUR handleSubmit :", err);
      toast.error(`❌ Erreur : ${err.message}`);
    } finally {
      console.groupEnd();
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      marginLeft: "280px", 
      padding: "2rem", 
      background: "#f8fafc", 
      minHeight: "100vh" 
    }}>
      <DashboardMenu />
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <header style={{ marginBottom: "2rem" }}>
          
        <ContactCoachModal />
        </header>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1.3fr", 
          gap: "2rem", 
          alignItems: "start" 
        }}>
          {/* Formulaire */}
          <div style={{ 
            background: "white", 
            padding: "2rem", 
            borderRadius: "24px", 
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", 
            border: "1px solid #e2e8f0" 
          }}>
            
            <h2 style={{ 
              fontSize: "1.25rem", 
              fontWeight: "700", 
              marginBottom: "1.5rem", 
              color: "#1e293b"
            }}>
              📋 Informations personnelles
            </h2>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr", 
              gap: "1rem", 
              marginBottom: "1.5rem" 
            }}>
              <div>
                <label style={{ 
                  fontSize: "0.875rem", 
                  fontWeight: "600", 
                  color: "#475569", 
                  display: "block", 
                  marginBottom: "0.5rem" 
                }}>
                  Sexe <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input 
                  type="text" 
                  value={sexe ?? ""} 
                  readOnly 
                  style={{ 
                    width: "100%", 
                    padding: "0.75rem", 
                    borderRadius: "10px", 
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    color: "#0f172a",
                    fontWeight: "600",
                    textTransform: "capitalize"
                  }} 
                />
              </div>
            </div>

            {/* Info mesures requises */}
            {sexe && (
              <div style={{ 
                background: "linear-gradient(135deg, #667eea15, #764ba215)", 
                padding: "1rem", 
                borderRadius: "12px", 
                marginBottom: "1.5rem",
                border: "1px solid #667eea30"
              }}>
                <p style={{ 
                  fontSize: "0.875rem", 
                  color: "#475569", 
                  margin: 0,
                  lineHeight: "1.6"
                }}>
                  <strong style={{ color: "#667eea" }}>📍 Mesures requises :</strong><br/>
                  {sexe === "homme" && "🔵 Tour de cou, Tour de taille, Hauteur"}
                  {sexe === "femme" && "🟣 Tour de cou, Tour de taille, Tour de hanches, Hauteur"}
                </p>
              </div>
            )}

            <h2 style={{ 
              fontSize: "1.25rem", 
              fontWeight: "700", 
              marginBottom: "1.5rem", 
              marginTop: "2rem", 
              color: "#1e293b"
            }}>
              📏 Mesures corporelles (cm)
            </h2>
            
            <div style={{ 
              display: "grid", 
              gap: "1rem", 
              marginBottom: "1.5rem" 
            }}>
              {/* Tour de cou */}
              <div>
                <label style={{ 
                  fontSize: "0.875rem", 
                  fontWeight: "600", 
                  color: "#0f172a",
                  display: "block", 
                  marginBottom: "0.5rem"
                }}>
                  Tour de cou <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={mesures.cou}
                  placeholder="38.0"
                  onChange={e => handleInputChange("cou", e.target.value)}
                  style={{ 
                    width: "100%", 
                    padding: "0.75rem", 
                    borderRadius: "10px", 
                    border: !mesures.cou ? "2px solid #ef4444" : "1px solid #cbd5e1",
                    background: "white",
                    color: "#0f172a",
                    fontWeight: "600",
                    fontSize: "1rem"
                  }}
                />
              </div>

              {/* Tour de taille */}
              <div>
                <label style={{ 
                  fontSize: "0.875rem", 
                  fontWeight: "600", 
                  color: "#0f172a",
                  display: "block", 
                  marginBottom: "0.5rem"
                }}>
                  Tour de taille (abdomen) <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={mesures.taille}
                  placeholder="85.0"
                  onChange={e => handleInputChange("taille", e.target.value)}
                  style={{ 
                    width: "100%", 
                    padding: "0.75rem", 
                    borderRadius: "10px", 
                    border: !mesures.taille ? "2px solid #ef4444" : "1px solid #cbd5e1",
                    background: "white",
                    color: "#0f172a",
                    fontWeight: "600",
                    fontSize: "1rem"
                  }}
                />
              </div>

              {/* Tour de hanches (femmes uniquement) */}
              {sexe === "femme" && (
                <div>
                  <label style={{ 
                    fontSize: "0.875rem", 
                    fontWeight: "600", 
                    color: "#0f172a",
                    display: "block", 
                    marginBottom: "0.5rem"
                  }}>
                    Tour de hanches <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={mesures.hanches}
                    placeholder="95.0"
                    onChange={e => handleInputChange("hanches", e.target.value)}
                    style={{ 
                      width: "100%", 
                      padding: "0.75rem", 
                      borderRadius: "10px", 
                      border: !mesures.hanches ? "2px solid #ef4444" : "1px solid #cbd5e1",
                      background: "white",
                      color: "#0f172a",
                      fontWeight: "600",
                      fontSize: "1rem"
                    }}
                  />
                </div>
              )}

              {/* Hauteur */}
              <div>
                <label style={{ 
                  fontSize: "0.875rem", 
                  fontWeight: "600", 
                  color: "#0f172a",
                  display: "block", 
                  marginBottom: "0.5rem"
                }}>
                  Hauteur (taille) <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={mesures.hauteur}
                  placeholder="170.0"
                  onChange={e => handleInputChange("hauteur", e.target.value)}
                  style={{ 
                    width: "100%", 
                    padding: "0.75rem", 
                    borderRadius: "10px", 
                    border: !mesures.hauteur ? "2px solid #ef4444" : "1px solid #cbd5e1",
                    background: "white",
                    color: "#0f172a",
                    fontWeight: "600",
                    fontSize: "1rem"
                  }}
                />
              </div>
            </div>

            <label style={{ 
              fontSize: "0.875rem", 
              fontWeight: "600", 
              color: "#475569", 
              display: "block", 
              marginBottom: "0.5rem" 
            }}>
              Date de mesure
            </label>
            <input
              type="date"
              value={dateMesure}
              onChange={e => setDateMesure(e.target.value)}
              style={{ 
                width: "100%", 
                padding: "0.75rem", 
                borderRadius: "10px", 
                border: "1px solid #cbd5e1", 
                marginBottom: "1.5rem",
                fontWeight: "600"
              }}
            />

            {/* Affichage du résultat actuel */}
            {bodyFat && (
              <div style={{ 
                background: "linear-gradient(135deg, #10b98115, #059669 15)", 
                padding: "1rem", 
                borderRadius: "12px", 
                marginBottom: "1.5rem",
                border: "1px solid #10b98130",
                textAlign: "center"
              }}>
                <p style={{ 
                  fontSize: "0.875rem", 
                  color: "#475569", 
                  margin: "0 0 0.5rem 0"
                }}>
                  Dernier résultat :
                </p>
                <p style={{ 
                  fontSize: "2rem", 
                  fontWeight: "800", 
                  color: "#10b981", 
                  margin: 0
                }}>
                  {bodyFat}%
                </p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !sexe}
              style={{ 
                width: "100%", 
                padding: "1rem", 
                borderRadius: "12px", 
                border: "none", 
                background: loading || !sexe ? "#94a3b8" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
                color: "white",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: loading || !sexe ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                boxShadow: loading || !sexe ? "none" : "0 4px 12px rgba(102, 126, 234, 0.4)"
              }}
            >
              {loading ? "⏳ Calcul en cours..." : "💾 Enregistrer la mesure"}
            </button>
          </div>

          {/* Visualisation */}
          <div style={{ position: "sticky", top: "2rem" }}>
            <BodyVisualizerUSNavy 
              mesures={mesures}
              setMesures={setMesures}
              sexe={sexe}
              bodyFat={bodyFat}
            />
          </div>
        </div>
      </div>
    </div>
  );
}