import React, { useState } from 'react';
import { X, Mail, MessageSquare, User } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ContactCoachModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    objectif: 'prise_masse',
    message: '',
    budget: ''
  });

  const objectifs = [
    { value: 'prise_masse', label: 'Prise de masse musculaire' },
    { value: 'perte_poids', label: 'Perte de poids' },
    { value: 'maintenance', label: 'Maintenance & définition' },
    { value: 'performance', label: 'Performance sportive' },
    { value: 'autre', label: 'Autre' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.nom || !formData.email || !formData.objectif) {
      toast.error('❌ Veuillez remplir tous les champs requis');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      const payload = {
        userId,
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        objectif: formData.objectif,
        message: formData.message,
        budget: formData.budget,
        dateDemande: new Date().toISOString()
      };

      const res = await fetch('http://localhost:5000/coaching/demanderPlan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Erreur lors de l\'envoi de la demande');
      }

      toast.success('✅ Votre demande a été envoyée au coach !');
      setIsOpen(false);
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        objectif: 'prise_masse',
        message: '',
        budget: ''
      });

    } catch (err) {
      console.error('Erreur:', err);
      toast.error('❌ Erreur lors de l\'envoi de la demande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          transition: 'all 0.3s ease',
          transform: 'scale(1)',
          hover: {
            transform: 'scale(1.1)',
            boxShadow: '0 12px 30px rgba(102, 126, 234, 0.6)'
          }
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        title="Contacter un coach"
      >
        💬
      </button>

      {/* Modal */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: 0,
                  marginBottom: '0.25rem'
                }}>
                  🏋️ Plan Nutritionnel Personnalisé
                </h2>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  margin: 0
                }}>
                  Contactez un coach pour votre plan
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}
              >
                <X size={20} color="#475569" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{
              display: 'grid',
              gap: '1.25rem'
            }}>
              {/* Nom */}
              <div>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  👤 Nom complet <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  📧 Email <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Téléphone */}
              <div>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  📱 Téléphone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="+216 XX XXX XXX"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Objectif */}
              <div>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  🎯 Votre objectif <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="objectif"
                  value={formData.objectif}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                >
                  {objectifs.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  💰 Budget estimé (DT/mois)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="500"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Message */}
              <div>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  💬 Message personnalisé
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Décrivez votre situation, vos contraintes alimentaires, etc..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    minHeight: '100px',
                    resize: 'vertical',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Boutons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginTop: '1.5rem'
              }}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#475569',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.background = 'white'}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '8px',
                    background: loading ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {loading ? '⏳ Envoi...' : '✉️ Envoyer la demande'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}