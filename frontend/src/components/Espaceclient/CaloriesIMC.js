import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardMenu from "./DashboardMenu";
import { getDernierIMC } from "../../service/apiImc";

export default function CaloriesIMC() {
  const [niveauActivite, setNiveauActivite] = useState("Sedentary");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const resultsRef = useRef(null);

  const activiteOptions = [
    {
      value: "Sedentary",
      label: "🛋️ Sédentaire",
      desc: "Peu ou pas d'exercice",
    },
    {
      value: "Light",
      label: "🚶 Légèrement actif",
      desc: "Exercice 1-3 fois/semaine",
    },
    {
      value: "Moderate",
      label: "🏃 Modérément actif",
      desc: "Exercice 3-5 fois/semaine",
    },
    { value: "Active", label: "💪 Actif", desc: "Exercice 6-7 fois/semaine" },
    {
      value: "Very Active",
      label: "🏋️ Très actif",
      desc: "Exercice intense quotidien",
    },
    {
      value: "Extra Active",
      label: "⚡ Extrêmement actif",
      desc: "Athlète professionnel",
    },
  ];

  useEffect(() => {
    const chargerDernierIMC = async () => {
      try {
        setInitialLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Utilisateur non connecté");
          setInitialLoading(false);
          return;
        }
        const decoded = jwtDecode(token);
        const id = decoded.id;
        const response = await getDernierIMC(id);
        if (response?.data) {
          setResults(response.data);
        }
      } catch (error) {
        console.warn("Aucun IMC précédent trouvé");
      } finally {
        setInitialLoading(false);
      }
    };
    chargerDernierIMC();
  }, []);

  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [results]);
const calculateCalories = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error(" Utilisateur non connecté");
      return;
    }
    const decoded = jwtDecode(token);
    const id = decoded.id;

    const response = await fetch(
      `http://localhost:5000/users/calculate/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ niveauActivite }),
      }
    );

    const data = await response.json();
    if (!response.ok || !data.success) {
      toast.error(data.message || "Erreur lors du calcul");
      return;
    }
    toast.success("Calculs effectués avec succès !");

    const dernierIMC = await getDernierIMC(id);
    if (dernierIMC?.data) {
      setResults(dernierIMC.data);
    }
  } catch (error) {
    console.error("Erreur:", error);
    toast.error("Erreur lors du calcul des calories");
  } finally {
    setLoading(false);
  }
};

  const getIMCCategory = (classification) => {
    const categories = {
      Normal: { label: "Poids normal", color: "#10b981", icon: "✅" },
      Overweight: { label: "Surpoids", color: "#f59e0b", icon: "⚠️" },
      "Obese Class I": {
        label: "Obésité classe I",
        color: "#f97316",
        icon: "⚠️",
      },
      "Obese Class II": {
        label: "Obésité classe II",
        color: "#ef4444",
        icon: "⚠️",
      },
      "Obese Class III": {
        label: "Obésité classe III",
        color: "#dc2626",
        icon: "🚨",
      },
      "Mild Thinness": {
        label: "Maigreur légère",
        color: "#f59e0b",
        icon: "⚠️",
      },
      "Moderate Thinness": {
        label: "Maigreur modérée",
        color: "#f97316",
        icon: "⚠️",
      },
      "Severe Thinness": {
        label: "Maigreur sévère",
        color: "#ef4444",
        icon: "⚠️",
      },
    };
    return (
      categories[classification] || {
        label: classification || "-",
        color: "#6b7280",
        icon: "ℹ️",
      }
    );
  };

  const getObjectifLabel = (type) => {
    const objectifs = {
      perte: { label: "Perte de poids", icon: "📉", color: "#10b981" },
      gain: { label: "Gain de poids", icon: "📈", color: "#2563eb" },
      maintien: { label: "Maintien", icon: "➡️", color: "#6b7280" },
    };
    return objectifs[type] || objectifs["maintien"];
  };

  if (initialLoading) {
    return (
      <div
        style={{
          marginLeft: "280px",
          padding: "2rem",
          background: "#f5f5f5",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
          <p style={{ fontSize: "1.2rem", color: "#6b7280" }}>
            Chargement de vos données...
          </p>
        </div>
      </div>
    );
  }

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
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "0.5rem",
            }}
          >
            🔥 Calculateur de Calories & IMC
          </h1>
          <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>
            {results
              ? "📊 Voici votre dernier calcul"
              : "Calculez vos besoins caloriques en fonction de votre niveau d'activité"}
          </p>
        </div>

        {results && (
          <div ref={resultsRef}>
            <ResultatsIMC
              results={results}
              getIMCCategory={getIMCCategory}
              getObjectifLabel={getObjectifLabel}
            />
            <RecalculSection
              niveauActivite={niveauActivite}
              setNiveauActivite={setNiveauActivite}
              activiteOptions={activiteOptions}
              calculateCalories={calculateCalories}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, color }) {
  return (
    <div
      style={{
        padding: "1rem",
        background: `${color}15`,
        borderRadius: "8px",
        border: `2px solid ${color}`,
      }}
    >
      <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{icon}</div>
      <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>{label}</div>
      <div style={{ fontSize: "1.3rem", fontWeight: "700", color }}>
        {value}
      </div>
    </div>
  );
}

function CalorieCard({
  icon,
  title,
  value,
  description,
  color,
  bgColor,
  highlight,
}) {
  return (
    <div
      style={{
        padding: "1.5rem",
        borderRadius: "10px",
        background: bgColor,
        border: highlight ? `3px solid ${color}` : "2px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{icon}</div>
      <div
        style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "0.5rem" }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          color,
          marginBottom: "0.5rem",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>{description}</div>
    </div>
  );
}

function RecalculSection({
  niveauActivite,
  setNiveauActivite,
  activiteOptions,
  calculateCalories,
  loading,
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "2rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginTop: "2rem",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#1f2937",
          marginBottom: "1.5rem",
        }}
      >
        🏃 Recalculer votre niveau d'activité
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {activiteOptions.map((option) => (
          <div
            key={option.value}
            onClick={() => setNiveauActivite(option.value)}
            style={{
              padding: "1.25rem",
              borderRadius: "10px",
              border:
                niveauActivite === option.value
                  ? "3px solid #2563eb"
                  : "2px solid #e5e7eb",
              background: niveauActivite === option.value ? "#eff6ff" : "white",
              cursor: "pointer",
              transition: "all 0.2s ease",
              position: "relative",
            }}
          >
            {niveauActivite === option.value && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "#2563eb",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.75rem",
                }}
              >
                ✓
              </div>
            )}
            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "0.5rem",
              }}
            >
              {option.label}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
              {option.desc}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={calculateCalories}
        disabled={loading}
        style={{
          width: "100%",
          padding: "1rem",
          background: loading
            ? "#9ca3af"
            : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "1.1rem",
          fontWeight: "700",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
        }}
      >
        {loading ? "⏳ Calcul en cours..." : "🔄 Recalculer"}
      </button>
    </div>
  );
}

function ResultatsIMC({ results, getIMCCategory, getObjectifLabel }) {
  return (
    <>
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "1.5rem",
          }}
        >
          👤 Votre Profil
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
          }}
        >
          <InfoCard
            icon="⚖️"
            label="Poids"
            value={`${results.poids ?? "-"} kg`}
            color="#3b82f6"
          />
          <InfoCard
            icon="📏"
            label="Taille"
            value={`${results.taille ?? "-"} cm`}
            color="#8b5cf6"
          />
          <InfoCard
            icon="🎂"
            label="Âge"
            value={`${results.age ?? "-"} ans`}
            color="#ec4899"
          />
          <InfoCard
            icon="🚻"
            label="Sexe"
            value={results.sexe ?? "-"}
            color="#10b981"
          />
        </div>
      </div>

      {results.imc && (
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "1.5rem",
            }}
          >
            📊 Votre Indice de Masse Corporelle (IMC)
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.5rem",
              background: `${
                getIMCCategory(results.imc?.classification).color
              }15`,
              borderRadius: "10px",
              border: `3px solid ${
                getIMCCategory(results.imc?.classification).color
              }`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: getIMCCategory(results.imc?.classification).color,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                }}
              >
                {results.imc?.valeur ?? "-"}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#1f2937",
                  }}
                >
                  {getIMCCategory(results.imc?.classification).icon}{" "}
                  {getIMCCategory(results.imc?.classification).label}
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#6b7280",
                    marginTop: "0.25rem",
                  }}
                >
                  Risque pour la santé: {results.imc?.risque ?? "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {results.calories && (
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "1.5rem",
            }}
          >
            🔥 Vos Besoins Caloriques
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <CalorieCard
              icon="💤"
              title="Métabolisme de Base (BMR)"
              value={`${results.calories?.bmr ?? "-"} kcal`}
              description="Calories brûlées au repos"
              color="#8b5cf6"
              bgColor="#f5f3ff"
            />
            <CalorieCard
              icon="⚖️"
              title="Calories de Maintien"
              value={`${results.calories?.maintenance ?? "-"} kcal`}
              description="Pour maintenir votre poids"
              color="#2563eb"
              bgColor="#eff6ff"
            />
            <CalorieCard
              icon={getObjectifLabel(results.calories?.typeObjectif).icon}
              title={`Objectif: ${
                getObjectifLabel(results.calories?.typeObjectif).label
              }`}
              value={`${results.calories?.objectif ?? "-"} kcal`}
              description="Calories recommandées"
              color={getObjectifLabel(results.calories?.typeObjectif).color}
              bgColor={`${
                getObjectifLabel(results.calories?.typeObjectif).color
              }15`}
              highlight={true}
            />
          </div>
        </div>
      )}
    </>
  );
}
