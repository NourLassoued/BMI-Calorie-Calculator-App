import React, { useState, useEffect ,useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardMenu from './DashboardMenu';

export default function CaloriesIMC() {
  const [niveauActivite, setNiveauActivite] = useState('Sedentary');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef(null);
  useEffect(() => {
  if (results && resultsRef.current) {
    resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}, [results]);


  const activiteOptions = [
    { value: 'Sedentary', label: '🛋️ Sédentaire', desc: 'Peu ou pas d\'exercice' },
    { value: 'Light', label: '🚶 Légèrement actif', desc: 'Exercice 1-3 fois/semaine' },
    { value: 'Moderate', label: '🏃 Modérément actif', desc: 'Exercice 3-5 fois/semaine' },
    { value: 'Active', label: '💪 Actif', desc: 'Exercice 6-7 fois/semaine' },
    { value: 'Very Active', label: '🏋️ Très actif', desc: 'Exercice intense quotidien' },
    { value: 'Extra Active', label: '⚡ Extrêmement actif', desc: 'Athlète professionnel' }
  ];


  const calculateCalories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('❌ Utilisateur non connecté');
        return;
      }

      // Décoder le token pour obtenir l'ID automatiquement
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await fetch(`http://localhost:5000/users/calculate/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ niveauActivite })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResults(data.data);
        toast.success(' Calculs effectués avec succès !');
      } else {
        toast.error(data.message || 'Erreur lors du calcul');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du calcul des calories');
    } finally  {
      setLoading(false);
    }
  };

  const getIMCCategory = (classification) => {
    const categories = {
      'Normal': { label: 'Poids normal', color: '#10b981', icon: '✅' },
      'Overweight': { label: 'Surpoids', color: '#f59e0b', icon: '⚠️' },
      'Obese Class I': { label: 'Obésité classe I', color: '#f97316', icon: '⚠️' },
      'Obese Class II': { label: 'Obésité classe II', color: '#ef4444', icon: '⚠️' },
      'Obese Class III': { label: 'Obésité classe III', color: '#dc2626', icon: '🚨' },
      'Mild Thinness': { label: 'Maigreur légère', color: '#f59e0b', icon: '⚠️' },
      'Moderate Thinness': { label: 'Maigreur modérée', color: '#f97316', icon: '⚠️' },
      'Severe Thinness': { label: 'Maigreur sévère', color: '#ef4444', icon: '⚠️' }
    };
    return categories[classification] || { label: classification, color: '#6b7280', icon: 'ℹ️' };
  };

  const getObjectifLabel = (type) => {
    const objectifs = {
      'perte': { label: 'Perte de poids', icon: '📉', color: '#10b981' },
      'gain': { label: 'Gain de poids', icon: '📈', color: '#2563eb' },
      'maintien': { label: 'Maintien', icon: '➡️', color: '#6b7280' }
    };
    return objectifs[type] || objectifs['maintien'];
  };


  return (
    <div style={{ marginLeft: '280px', padding: '2rem', background: '#f5f5f5', minHeight: '100vh' }}>
      <DashboardMenu />
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* En-tête */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
            🔥 Calculateur de Calories & IMC
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            Calculez vos besoins caloriques en fonction de votre niveau d'activité
          </p>
        </div>

        {/* Sélecteur d'activité */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
            🏃 Sélectionnez votre niveau d'activité
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {activiteOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => setNiveauActivite(option.value)}
                style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: niveauActivite === option.value ? '3px solid #2563eb' : '2px solid #e5e7eb',
                  background: niveauActivite === option.value ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (niveauActivite !== option.value) {
                    e.currentTarget.style.borderColor = '#2563eb';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (niveauActivite !== option.value) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {niveauActivite === option.value && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#2563eb',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.75rem'
                  }}>
                    ✓
                  </div>
                )}
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
                  {option.label}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                  {option.desc}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={calculateCalories}
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
            }}
          >
            {loading ? '⏳ Calcul en cours...' : '🔥 Calculer mes besoins caloriques'}
          </button>
        </div>

        {/* Résultats */}
        {results && (
          
           <div ref={resultsRef}>
          
          
            {/* Profil utilisateur */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                👤 Votre Profil
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <InfoCard icon="⚖️" label="Poids" value={`${results.utilisateur.poids} kg`} color="#3b82f6" />
                <InfoCard icon="📏" label="Taille" value={`${results.utilisateur.taille} cm`} color="#8b5cf6" />
                <InfoCard icon="🎂" label="Âge" value={`${results.utilisateur.age} ans`} color="#ec4899" />
                <InfoCard icon="🚻" label="Sexe" value={results.utilisateur.sexe} color="#10b981" />
              </div>
            </div>

            {/* IMC */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                📊 Votre Indice de Masse Corporelle (IMC)
              </h2>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.5rem',
                background: `${getIMCCategory(results.imc.classification).color}15`,
                borderRadius: '10px',
                border: `3px solid ${getIMCCategory(results.imc.classification).color}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: getIMCCategory(results.imc.classification).color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700'
                  }}>
                    {results.imc.valeur}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                      {getIMCCategory(results.imc.classification).icon} {getIMCCategory(results.imc.classification).label}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      Risque pour la santé: {results.imc.risque}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calories */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                🔥 Vos Besoins Caloriques
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <CalorieCard
                  icon="💤"
                  title="Métabolisme de Base (BMR)"
                  value={`${results.calories.bmr} kcal`}
                  description="Calories brûlées au repos"
                  color="#8b5cf6"
                  bgColor="#f5f3ff"
                />

                <CalorieCard
                  icon="⚖️"
                  title="Calories de Maintien"
                  value={`${results.calories.maintenance} kcal`}
                  description="Pour maintenir votre poids"
                  color="#2563eb"
                  bgColor="#eff6ff"
                />

                <CalorieCard
                  icon={getObjectifLabel(results.calories.typeObjectif).icon}
                  title={`Objectif: ${getObjectifLabel(results.calories.typeObjectif).label}`}
                  value={`${results.calories.objectif} kcal`}
                  description="Calories recommandées"
                  color={getObjectifLabel(results.calories.typeObjectif).color}
                  bgColor={`${getObjectifLabel(results.calories.typeObjectif).color}15`}
                  highlight={true}
                />
              </div>
            </div>

            {/* Recommandations */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                🎯 Recommandations
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <RecoCard label="Poids idéal" value={`${results.recommandations.poidsIdeal} kg`} color="#3b82f6" />
                <RecoCard label="Poids cible" value={`${results.recommandations.poidsCible} kg`} color="#8b5cf6" />
                <RecoCard label="À modifier" value={`${results.recommandations.difference} kg`} color="#ec4899" />
              </div>
              <div style={{
                marginTop: '1.5rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                borderRadius: '10px',
                border: '2px solid #2563eb'
              }}>
                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  💡 {results.recommandations.message}
                </p>
              </div>
            </div>

            {/* Objectif actif */}
            {results.objectifActuel && (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                  🎯 Objectif Actif
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <ObjectifCard label="Type" value={results.objectifActuel.type} />
                  <ObjectifCard label="Poids départ" value={`${results.objectifActuel.poidsDepart} kg`} />
                  <ObjectifCard label="Poids cible" value={`${results.objectifActuel.poidsCible} kg`} />
                  <ObjectifCard label="Rythme" value={`${results.objectifActuel.rythemeKgparSemaine} kg/sem`} />
                </div>
              </div>
            )}

            {/* Plan rythme */}
            {results.planRythme && (
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                borderRadius: '12px',
                padding: '2rem',
                border: '2px solid #10b981',
                marginBottom: '2rem'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                  📅 Votre Plan Personnalisé
                </h2>
                <div style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  marginBottom: '1rem'
                }}>
                  <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
                    Rythme: {results.planRythme.rythme.kgParSemaine} kg/semaine
                  </p>
                  <p style={{ color: '#6b7280', margin: 0 }}>{results.planRythme.rythme.description}</p>
                  <p style={{ color: '#10b981', marginTop: '0.5rem', fontWeight: '600' }}>
                    Soit environ {results.planRythme.rythme.kgParMois} kg/mois
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <AjustementCard 
                    label="Ajustement journalier" 
                    value={`${results.planRythme.ajustementCalorique.journalier > 0 ? '+' : ''}${results.planRythme.ajustementCalorique.journalier} kcal`} 
                    color="#ef4444"
                  />
                  <AjustementCard 
                    label="Ajustement hebdomadaire" 
                    value={`${results.planRythme.ajustementCalorique.hebdomadaire > 0 ? '+' : ''}${results.planRythme.ajustementCalorique.hebdomadaire} kcal`} 
                    color="#f97316"
                  />
                </div>
              </div>
            )}

            {/* Progression estimée */}
            {results.progressionEstimee && (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                  📊 Progression Estimée
                </h2>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '600', color: '#374151' }}>Progression</span>
                    <span style={{ fontWeight: '700', color: '#2563eb' }}>{results.progressionEstimee.progressionPourcent}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '20px',
                    background: '#e5e7eb',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(results.progressionEstimee.progressionPourcent, 100)}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
                      transition: 'width 1s ease'
                    }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <ProgressCard label="Poids restant" value={`${results.progressionEstimee.poidsRestant} kg`} color="#3b82f6" />
                  <ProgressCard label="Durée estimée" value={`${results.progressionEstimee.dureeEstimee.semaines} sem`} color="#8b5cf6" />
                  <ProgressCard label="Date fin" value={new Date(results.progressionEstimee.dureeEstimee.dateFinEstimee).toLocaleDateString()} color="#ec4899" />
                </div>
              </div>
            )}

            {/* Conseils */}
            <div style={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              borderRadius: '12px',
              padding: '2rem',
              border: '2px solid #2563eb'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
                💡 Conseils personnalisés
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <Conseil icon="🍽️" text={`Consommez environ ${results.calories.objectif} calories par jour pour atteindre votre objectif`} />
                <Conseil icon="💧" text="Hydratez-vous : buvez au moins 2 litres d'eau par jour" />
                <Conseil icon="🥗" text="Privilégiez les aliments riches en protéines et fibres" />
                <Conseil icon="😴" text="Dormez 7-9 heures par nuit pour optimiser votre métabolisme" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Composants auxiliaires
function InfoCard({ icon, label, value, color }) {
  return (
    <div style={{ padding: '1rem', background: `${color}15`, borderRadius: '8px', border: `2px solid ${color}` }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{icon}</div>
      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{label}</div>
      <div style={{ fontSize: '1.3rem', fontWeight: '700', color: color }}>{value}</div>
    </div>
  );
}

function CalorieCard({ icon, title, value, description, color, bgColor, highlight }) {
  return (
    <div style={{
      padding: '1.5rem',
      borderRadius: '10px',
      background: bgColor,
      border: highlight ? `3px solid ${color}` : '2px solid transparent',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
      <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>{title}</div>
      <div style={{ fontSize: '2rem', fontWeight: '700', color: color, marginBottom: '0.5rem' }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{description}</div>
    </div>
  );
}

function RecoCard({ label, value, color }) {
  return (
    <div style={{ padding: '1rem', background: `${color}15`, borderRadius: '8px', border: `2px solid ${color}` }}>
      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: color }}>{value}</div>
    </div>
  );
}

function ObjectifCard({ label, value }) {
  return (
    <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '2px solid #e5e7eb' }}>
      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1f2937', textTransform: 'capitalize' }}>{value}</div>
    </div>
  );
}

function AjustementCard({ label, value, color }) {
  return (
    <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', border: `2px solid ${color}` }}>
      <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: '700', color: color }}>{value}</div>
    </div>
  );
}

function ProgressCard({ label, value, color }) {
  return (
    <div style={{ padding: '1rem', background: `${color}15`, borderRadius: '8px', border: `2px solid ${color}` }}>
      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ fontSize: '1.3rem', fontWeight: '700', color: color }}>{value}</div>
    </div>
  );
}

function Conseil({ icon, text }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'start',
      gap: '0.75rem',
      padding: '1rem',
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    }}>
      <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</span>
      <p style={{ margin: 0, fontSize: '0.95rem', color: '#374151', lineHeight: '1.5' }}>{text}</p>
    </div>
  );
}