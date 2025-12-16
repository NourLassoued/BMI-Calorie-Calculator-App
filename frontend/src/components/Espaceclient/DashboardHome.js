"use client"

import { useState, useEffect, useRef } from "react"
import { jwtDecode } from "jwt-decode"
import "../../styles/home.css"
import DashboardMenu from "./DashboardMenu"
import { getUserById } from "../../service/apiUser"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function DashboardHome() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("")
  const [formValue, setFormValue] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) throw new Error("Utilisateur non connecté")

        const decoded = jwtDecode(token)
        console.log("JWT decoded :", decoded)

        const data = await getUserById(decoded.id)
        setUserData(data)
      } catch (error) {
        console.error("Erreur récupération utilisateur :", error)
        toast.error("Erreur lors du chargement des données")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [navigate])

  const handleOpenModal = (type, currentValue) => {
    setModalType(type)
    setFormValue(currentValue || "")
    setShowModal(true)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La taille de l'image ne doit pas dépasser 5MB")
        return
      }

      // Vérifier le type
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner une image valide")
        return
      }

      setSelectedFile(file)

      // Prévisualisation
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Upload automatique
      handleImageUpload(file)
    }
  }

  const refreshUserData = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) throw new Error("Utilisateur non connecté")

      const decoded = jwtDecode(token)
      const data = await getUserById(decoded.id)
      setUserData(data)
      return data
    } catch (error) {
      console.error("Erreur lors du refresh des données:", error)
      throw error
    }
  }

  const handleImageUpload = async (file) => {
    try {
      setUploadingImage(true)
      const token = localStorage.getItem("authToken")
      const decoded = jwtDecode(token)

      const formData = new FormData()
      formData.append("image_user", file)

      const response = await fetch(`http://localhost:5000/users/updateUser/${decoded.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        await refreshUserData()
        toast.success("Photo de profil mise à jour avec succès !")
        setImagePreview(null)
        setSelectedFile(null)
      } else {
        throw new Error("Erreur lors de l'upload")
      }
    } catch (error) {
      console.error("Erreur upload image:", error)
      toast.error("Erreur lors de l'upload de l'image")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("authToken")
      const decoded = jwtDecode(token)

      let updateData = {}

      switch (modalType) {
        case "taille":
          updateData = { taille: Number.parseFloat(formValue) }
          break
        case "sexe":
          updateData = { sexe: formValue }
          break
        case "poidsInitial":
          updateData = { poidsInitial: Number.parseFloat(formValue) }
          break
        case "poidsActuel":
          updateData = { poidsActuel: Number.parseFloat(formValue) }
          break
        case "poidsCible":
          updateData = { poidsCible: Number.parseFloat(formValue) }
          break
        default:
          break
      }

      const response = await fetch(`http://localhost:5000/users/updateUser/${decoded.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        await refreshUserData()
        setShowModal(false)
        setFormValue("")
        toast.success("Information mise à jour avec succès !")
      } else {
        throw new Error("Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur lors de la mise à jour")
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "2rem",
        }}
      >
        ⏳ Chargement...
      </div>
    )
  }

  if (!userData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "1.5rem",
        }}
      >
        ❌ Utilisateur non trouvé
      </div>
    )
  }

  const calculateDays = (startDate) => {
    if (!startDate) return 0
    const start = new Date(startDate)
    const today = new Date()
    return Math.ceil((today - start) / (1000 * 60 * 60 * 24))
  }

  const joursDepuisDebut = calculateDays(userData.createdAt)
  const progressionPoids = (userData.poidsDepart || 0) - (userData.poidsActuel || 0)
  const objectifTotal = (userData.poidsDepart || 0) - (userData.poidsCible || 0)
  const pourcentageProgression = objectifTotal > 0 ? ((progressionPoids / objectifTotal) * 100).toFixed(1) : 0

  const getModalTitle = () => {
    switch (modalType) {
      case "taille":
        return "Modifier la taille"
      case "sexe":
        return "Modifier le sexe"
      case "poidsDepart":
        return "Modifier le poids initial"
      case "poidsActuel":
        return "Modifier le poids actuel"
      case "poidsCible":
        return "Modifier le poids cible"
      default:
        return "Modifier"
    }
  }

  const getModalLabel = () => {
    switch (modalType) {
      case "taille":
        return "Taille (cm)"
      case "sexe":
        return "Sexe"
      case "poidsDepart":
        return "Poids Initial (kg)"
      case "poidsActuel":
        return "Poids Actuel (kg)"
      case "poidsCible":
        return "Poids Cible (kg)"
      default:
        return "Valeur"
    }
  }

  const getModalIcon = () => {
    switch (modalType) {
      case "taille":
        return "📏"
      case "sexe":
        return "⚧"
      case "poidsDepart":
        return "🏋️"
      case "poidsActuel":
        return "⚖️"
      case "poidsCible":
        return "🎯"
      default:
        return "✏️"
    }
  }


const isPerte = progressionPoids > 0  // true si perte
const progressionColor = isPerte
  ? "#10b981"       // vert si perte
  : progressionPoids < 0
    ? "#ef4444"     // rouge si prise
    : "#6b7280"     // gris si stable
const progressionBgColor = "#e5e7eb" // fond barre gris clair
const progressionIcon = isPerte
  ? "🔥"
  : progressionPoids < 0
    ? "⚠️"
    : "⚖️"
const progressionLabel = isPerte
  ? "Perte de poids"
  : progressionPoids < 0
    ? "Prise de poids"
    : "Stable"


  return (
    <div className="dashboard-container">
      <DashboardMenu />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="dashboard-content">
        <div className="container">
          {/* 👋 Bienvenue */}
          <div className="welcome-header">
            <div>
              <h1 className="welcome-title">Bienvenue, {userData.prenom} 👋</h1>
              <p className="welcome-subtitle">Voici votre tableau de bord personnel</p>
            </div>
          </div>

          {/* 👤 Profil */}
          <div className="profile-card">
            <div className="profile-content">
              <div className="profile-avatar-section">
                <div
                  className="avatar"
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    position: "relative",
                    cursor: uploadingImage ? "wait" : "pointer",
                  }}
                >
                  {uploadingImage && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.5)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "2rem",
                        zIndex: 10,
                      }}
                    >
                      ⏳
                    </div>
                  )}

                  {imagePreview ? (
                    <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="avatar-image" />
                  ) : userData.image_user && userData.image_user !== "default.jpg" ? (
                    <img
                      src={`http://localhost:5000/uploads/${userData.image_user}`}
                      alt="Profil"
                      className="avatar-image"
                    />
                  ) : (
                    <span className="avatar-icon">👤</span>
                  )}

                  {/* Badge pour changer la photo */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "5px",
                      right: "5px",
                      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      borderRadius: "50%",
                      width: "35px",
                      height: "35px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      boxShadow: "0 2px 8px rgba(37, 99, 235, 0.5)",
                      border: "3px solid white",
                    }}
                  >
                    📷
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  disabled={uploadingImage}
                />

                <div className="profile-name-section">
                  <div className="profile-name">
                    {userData.prenom} {userData.nom}
                  </div>
                  <div className="profile-email">{userData.email}</div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#6b7280",
                      marginTop: "0.5rem",
                    }}
                  >
                    📷 Cliquez sur l'avatar pour changer la photo
                  </p>
                </div>
              </div>

              <div className="profile-info-section">
                <h3 className="section-title">📋 Informations personnelles</h3>

                <div className="info-grid">
                  <InfoCardWithButton
                    label="Taille"
                    value={`${userData.taille || "--"} cm`}
                    icon="📏"
                    onEdit={() => handleOpenModal("taille", userData.taille)}
                  />
                  <InfoCard
                    label="Sexe"
                    value={userData.sexe || "Non défini"}
                    icon="⚧"
                    editable={true}
                    onEdit={() => handleOpenModal("sexe", userData.sexe)}
                  />
                  <InfoCard label="Compte créé depuis" value={`${joursDepuisDebut} jours`} icon="📅" />
                </div>
              </div>
            </div>
          </div>

          {/* ⚖️ Stats avec boutons */}
          <div className="stats-grid">
            <StatCard
              title="Poids Initial"
              value={`${userData.poidsDepart || 0} kg`}
              icon="🏋️"
            />
            <StatCard
              title="Poids Actuel"
              value={`${userData.poidsActuel || 0} kg`}
              icon="⚖️"
            />
            <StatCard
              title="Poids Cible"
              value={`${userData.poidsCible || 0} kg`}
              icon="🎯"
            />
          </div>

         {/* 📈 Progression */}
<div className="progression-card">
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
    <h3 style={{ margin: 0 }}>📈 Votre progression</h3>
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '600',
      background: progressionBgColor,
      color: progressionColor
    }}>
      <span style={{ fontSize: '1.2rem' }}>{progressionIcon}</span>
      <span>{progressionLabel}</span>
    </div>
  </div>

  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    padding: '1rem',
    background: progressionBgColor,
    borderRadius: '8px',
    border: `2px solid ${progressionColor}33`
  }}>
    <span style={{ fontSize: '1.1rem', color: progressionColor, fontWeight: '600' }}>
      {progressionIcon} {Math.abs(progressionPoids).toFixed(1)} kg
    </span>
    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: progressionColor }}>
      {pourcentageProgression}%
    </span>
  </div>

  <div style={{
    width: '100%',
    height: '12px',
    background: '#e5e7eb',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '1rem'
  }}>
    <div style={{ 
      width: `${Math.min(Math.abs(pourcentageProgression), 100)}%`,
      height: '100%',
      background: `linear-gradient(90deg, ${progressionColor} 0%, ${progressionColor}dd 100%)`,
      borderRadius: '10px',
      transition: 'width 1s ease'
    }}/>
  </div>

  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#6b7280' }}>
    <span>🎯 Objectif : {Math.abs(objectifTotal).toFixed(1)} kg</span>
    <span>📊 Reste : {Math.abs(userData.poidsActuel - userData.poidsCible).toFixed(1)} kg</span>
  </div>

  {/* Message motivant */}
  {isPerte ? (
    <div style={{
      marginTop: '1rem',
      padding: '0.75rem',
      background: '#f0fdf4',
      border: '2px solid #10b981',
      borderRadius: '8px',
      color: '#047857',
      fontSize: '0.9rem',
      textAlign: 'center',
      fontWeight: '500'
    }}>
      🎉 Excellent travail ! Continuez comme ça !
    </div>
  ) : progressionPoids < 0 ? (
    <div style={{
      marginTop: '1rem',
      padding: '0.75rem',
      background: '#fef2f2',
      border: '2px solid #ef4444',
      borderRadius: '8px',
      color: '#dc2626',
      fontSize: '0.9rem',
      textAlign: 'center',
      fontWeight: '500'
    }}>
      ⚠️ Attention ! Vous avez pris du poids. Restez motivé !
    </div>
  ) : null}
</div>

          </div>
        </div>
      


      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content-small"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "450px",
              background: "white",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Header avec gradient */}
            <div
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                padding: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  color: "white",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "1.8rem" }}>{getModalIcon()}</span>
                {getModalTitle()}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "white",
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ padding: "2rem" }}>
                <div className="form-group">
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.75rem",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "1rem",
                    }}
                  >
                    <span style={{ fontSize: "1.3rem" }}>{getModalIcon()}</span>
                    {getModalLabel()}
                  </label>

                  {modalType === "sexe" ? (
                    <select
                      value={formValue}
                      onChange={(e) => setFormValue(e.target.value)}
                      required
                      autoFocus
                      style={{
                        width: "100%",
                        padding: "0.875rem",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "1.1rem",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#2563eb"
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)"
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#e5e7eb"
                        e.currentTarget.style.boxShadow = "none"
                      }}
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="homme">👨 Homme</option>
                      <option value="femme">👩 Femme</option>
                      <option value="autre">⚧ Autre</option>
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={formValue}
                      onChange={(e) => setFormValue(e.target.value)}
                      placeholder={getModalLabel()}
                      step="0.1"
                      required
                      autoFocus
                      style={{
                        width: "100%",
                        padding: "0.875rem",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "1.1rem",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#2563eb"
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)"
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#e5e7eb"
                        e.currentTarget.style.boxShadow = "none"
                      }}
                    />
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  padding: "1.5rem",
                  borderTop: "2px solid #e5e7eb",
                  background: "#f9fafb",
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
                    fontSize: "1rem",
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
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "1rem",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
                  }}
                >
                  ✅ Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Composant InfoCard avec bouton d'édition
function InfoCardWithButton({ label, value, icon, onEdit }) {
  return (
    <div className="info-card-editable">
      <div className="info-icon">{icon}</div>
      <div className="info-label">{label}</div>
      <div className="info-value">{value}</div>
      <button className="btn-edit-small" onClick={onEdit} title="Modifier">
        ✏️
      </button>
    </div>
  )
}

// Composant InfoCard normal sans bouton (ou avec bouton si editable)
function InfoCard({ label, value, icon, editable, onEdit }) {
  return (
    <div className={editable ? "info-card-editable" : "info-card"}>
      <div className="info-icon">{icon}</div>
      <div className="info-label">{label}</div>
      <div className="info-value">{value}</div>
      {editable && (
        <button className="btn-edit-small" onClick={onEdit} title="Modifier">
          ✏️
        </button>
      )}
    </div>
  )
}
// Composant StatCard simple sans bouton d'édition
function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  )


}


  

