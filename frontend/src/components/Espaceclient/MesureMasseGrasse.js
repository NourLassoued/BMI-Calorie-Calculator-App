import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardMenu from './DashboardMenu';

export default function MesureMasseGrasse() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plis, setPlis] = useState({
    poitrine: '',
    abdomen: '',
    cuisses: '',
    triceps: '',
    epaules: '',
    dos: '',
    subscapulaire: '',
    suprailiaque: '',
    mollet: ''
  });
  const [dateMesure, setDateMesure] = useState(new Date().toISOString().split('T')[0]);
  const [hoveredZone, setHoveredZone] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = jwtDecode(token);
      fetchUserInfo(decoded.id);
    }
  }, []);

  const fetchUserInfo = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/mesures/getDerniereMesure/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
      }
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
    }
  };

  const handleInputChange = (zone, value) => {
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setPlis(prev => ({ ...prev, [zone]: value }));
    }
  };

  const handleSubmit = async () => {
    const hasValues = Object.values(plis).some(v => v !== '');
    if (!hasValues) {
      toast.error('❌ Veuillez renseigner au moins une mesure');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const decoded = jwtDecode(token);
      
      const pilsFormatted = {};
      Object.keys(plis).forEach(key => {
        pilsFormatted[key] = plis[key] === '' ? null : parseFloat(plis[key]);
      });

      const response = await fetch(`http://localhost:5000/mesures/addMesure/${decoded.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pils: pilsFormatted,
          dateMesure
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`✅ Mesure enregistrée ! Masse grasse: ${data.pourcentageMasseGrasse}%`);
        
        setPlis({
          poitrine: '',
          abdomen: '',
          cuisses: '',
          triceps: '',
          epaules: '',
          dos: '',
          subscapulaire: '',
          suprailiaque: '',
          mollet: ''
        });
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('❌ Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const zonesHomme = [
    { key: 'poitrine', label: 'Poitrine', desc: 'Pli diagonal entre l\'aisselle et le mamelon', position: { top: '25%', left: '50%' }, color: '#ef4444' },
    { key: 'abdomen', label: 'Abdomen', desc: 'Pli vertical à 2 cm du nombril', position: { top: '45%', left: '50%' }, color: '#f97316' },
    { key: 'cuisses', label: 'Cuisses', desc: 'Pli vertical au milieu de la cuisse', position: { top: '72%', left: '50%' }, color: '#f59e0b' },
    { key: 'triceps', label: 'Triceps', desc: 'Pli vertical à l\'arrière du bras', position: { top: '32%', left: '18%' }, color: '#84cc16' },
    { key: 'epaules', label: 'Épaules', desc: 'Pli au niveau de l\'acromion', position: { top: '22%', left: '28%' }, color: '#06b6d4' },
    { key: 'subscapulaire', label: 'Sous-scapulaire', desc: 'Pli sous l\'omoplate', position: { top: '32%', left: '72%' }, color: '#3b82f6' },
    { key: 'suprailiaque', label: 'Supra-iliaque', desc: 'Pli au-dessus de la crête iliaque', position: { top: '48%', left: '72%' }, color: '#8b5cf6' },
    { key: 'dos', label: 'Dos', desc: 'Pli vertical milieu du dos', position: { top: '38%', left: '77%' }, color: '#a855f7' },
    { key: 'mollet', label: 'Mollet', desc: 'Pli médial du mollet', position: { top: '82%', left: '50%' }, color: '#ec4899' }
  ];

  const zonesFemme = [
    { key: 'poitrine', label: 'Poitrine', desc: 'Pli diagonal au-dessus du sein', position: { top: '28%', left: '50%' }, color: '#ef4444' },
    { key: 'abdomen', label: 'Abdomen', desc: 'Pli vertical à 2 cm du nombril', position: { top: '48%', left: '50%' }, color: '#f97316' },
    { key: 'cuisses', label: 'Cuisses', desc: 'Pli vertical au milieu de la cuisse', position: { top: '73%', left: '50%' }, color: '#f59e0b' },
    { key: 'triceps', label: 'Triceps', desc: 'Pli vertical à l\'arrière du bras', position: { top: '33%', left: '20%' }, color: '#84cc16' },
    { key: 'epaules', label: 'Épaules', desc: 'Pli au niveau de l\'acromion', position: { top: '24%', left: '30%' }, color: '#06b6d4' },
    { key: 'subscapulaire', label: 'Sous-scapulaire', desc: 'Pli sous l\'omoplate', position: { top: '33%', left: '70%' }, color: '#3b82f6' },
    { key: 'suprailiaque', label: 'Supra-iliaque', desc: 'Pli au-dessus de la crête iliaque', position: { top: '52%', left: '70%' }, color: '#8b5cf6' },
    { key: 'dos', label: 'Dos', desc: 'Pli vertical milieu du dos', position: { top: '40%', left: '75%' }, color: '#a855f7' },
    { key: 'mollet', label: 'Mollet', desc: 'Pli médial du mollet', position: { top: '83%', left: '50%' }, color: '#ec4899' }
  ];

  const zones = userInfo?.sexe === 'homme' ? zonesHomme : zonesFemme;

  return (
    <div style={{ marginLeft: '280px', padding: '2rem', background: '#f5f5f5', minHeight: '100vh' }}>
      <DashboardMenu />
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
            📏 Mesure de la Masse Grasse
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            Mesurez vos plis cutanés pour calculer votre pourcentage de masse grasse
          </p>
        </div>

        {userInfo && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Visualisation du corps */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              position: 'sticky',
              top: '2rem',
              height: 'fit-content'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
                {userInfo.sexe === 'homme' ? '👨 Corps Masculin' : '👩 Corps Féminin'}
              </h2>
              
              <div style={{ position: 'relative', width: '100%', paddingTop: '120%', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderRadius: '12px', border: '2px solid #e5e7eb' }}>
                <svg
                  viewBox="0 0 200 300"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                >
                  <defs>
                    <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#ffd4a9', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#ffb88c', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#e68a5c', stopOpacity: 1 }} />
                    </linearGradient>
                    <radialGradient id="skinRadial">
                      <stop offset="0%" style={{ stopColor: '#ffe0c4', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#e68a5c', stopOpacity: 1 }} />
                    </radialGradient>
                    <filter id="shadow3D">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                      <feOffset dx="1" dy="2" />
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3" />
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {userInfo.sexe === 'homme' ? (
                    <g filter="url(#shadow3D)">
                      <ellipse cx="100" cy="30" rx="18" ry="21" fill="url(#skinRadial)" stroke="#8b5e3c" strokeWidth="1" />
                      <ellipse cx="92" cy="28" rx="2" ry="3" fill="#3d2817" />
                      <ellipse cx="108" cy="28" rx="2" ry="3" fill="#3d2817" />
                      <path d="M 92 48 Q 96 51 100 51 Q 104 51 108 48 L 109 62 Q 100 65 91 62 Z" fill="url(#skinGradient)" stroke="#8b5e3c" strokeWidth="0.8" />
                      <ellipse cx="65" cy="75" rx="15" ry="18" fill="url(#skinGradient)" stroke="#c66b45" strokeWidth="1" />
                      <ellipse cx="135" cy="75" rx="15" ry="18" fill="url(#skinGradient)" stroke="#c66b45" strokeWidth="1" />
                      <ellipse cx="85" cy="80" rx="14" ry="16" fill="url(#skinGradient)" stroke="#c66b45" strokeWidth="1" />
                      <ellipse cx="115" cy="80" rx="14" ry="16" fill="url(#skinGradient)" stroke="#c66b45" strokeWidth="1" />
                      <rect x="75" y="95" width="50" height="55" rx="8" fill="url(#skinGradient)" stroke="#c66b45" strokeWidth="1" />
                      <line x1="100" y1="95" x2="100" y2="150" stroke="#d47a52" strokeWidth="0.8" opacity="0.4" />
                      <rect x="85" y="120" width="12" height="12" rx="2" fill="url(#skinRadial)" opacity="0.6" />
                      <rect x="103" y="120" width="12" height="12" rx="2" fill="url(#skinRadial)" opacity="0.6" />
                      <rect x="85" y="135" width="12" height="12" rx="2" fill="url(#skinRadial)" opacity="0.6" />
                      <rect x="103" y="135" width="12" height="12" rx="2" fill="url(#skinRadial)" opacity="0.6" />
                      <path d="M 52 68 Q 48 80 46 95 Q 44 110 42 125" stroke="url(#skinGradient)" strokeWidth="12" strokeLinecap="round" />
                      <path d="M 148 68 Q 152 80 154 95 Q 156 110 158 125" stroke="url(#skinGradient)" strokeWidth="12" strokeLinecap="round" />
                      <path d="M 75 150 Q 73 165 72 180 L 82 220 L 78 240" stroke="url(#skinGradient)" strokeWidth="16" strokeLinecap="round" />
                      <path d="M 125 150 Q 127 165 128 180 L 118 220 L 122 240" stroke="url(#skinGradient)" strokeWidth="16" strokeLinecap="round" />
                      <path d="M 78 240 Q 76 260 74 280" stroke="url(#skinGradient)" strokeWidth="14" strokeLinecap="round" />
                      <path d="M 122 240 Q 124 260 126 280" stroke="url(#skinGradient)" strokeWidth="14" strokeLinecap="round" />
                    </g>
                  ) : (
                    <g filter="url(#shadow3D)">
                      <ellipse cx="100" cy="30" rx="16" ry="19" fill="url(#skinRadial)" stroke="#8b5e3c" strokeWidth="1" />
                      <ellipse cx="92" cy="27" rx="2" ry="3" fill="#3d2817" />
                      <ellipse cx="108" cy="27" rx="2" ry="3" fill="#3d2817" />
                      <ellipse cx="90" cy="32" rx="3" ry="2" fill="#ff9e8c" opacity="0.4" />
                      <ellipse cx="110" cy="32" rx="3" ry="2" fill="#ff9e8c" opacity="0.4" />
                      <path d="M 92 48 Q 96 51 100 51 Q 104 51 108 48 L 109 61 Q 100 64 91 61 Z" fill="url(#skinGradient)" stroke="#8b5e3c" strokeWidth="0.7" />
                      <ellipse cx="75" cy="72" rx="13" ry="15" fill="url(#skinGradient)" stroke="#c66b45" strokeWidth="1" />
                      <ellipse cx="125" cy="72" rx="13" ry="15" fill="url(#skinGradient)" stroke="#c66b45" strokeWidth="1" />
                      <ellipse cx="87" cy="82" rx="13" ry="15" fill="url(#skinGradient)" stroke="#c66b45" strokeWidth="1" />
                      <ellipse cx="113" cy="82" rx="13" ry="15" fill="url(#skinGradient)" stroke="#c66b45" strokeWidth="1" />
                      <path d="M 70 75 Q 65 90 66 105 Q 68 122 71 138 L 129 138 Q 132 122 134 105 Q 135 90 130 75 Z" fill="url(#skinGradient)" stroke="#c66b45" strokeWidth="1" />
                      <path d="M 71 138 Q 73 148 76 158 L 124 158 Q 127 148 129 138 Z" fill="url(#skinGradient)" stroke="#c66b45" strokeWidth="1" />
                      <ellipse cx="100" cy="178" rx="30" ry="18" fill="url(#skinGradient)" stroke="#c66b45" strokeWidth="1" />
                      <path d="M 56 75 Q 52 88 50 102 Q 48 116 46 130" stroke="url(#skinGradient)" strokeWidth="10" strokeLinecap="round" />
                      <path d="M 144 75 Q 148 88 150 102 Q 152 116 154 130" stroke="url(#skinGradient)" strokeWidth="10" strokeLinecap="round" />
                      <path d="M 78 196 Q 76 218 74 240 Q 72 260 70 280" stroke="url(#skinGradient)" strokeWidth="18" strokeLinecap="round" />
                      <path d="M 122 196 Q 124 218 126 240 Q 128 260 130 280" stroke="url(#skinGradient)" strokeWidth="18" strokeLinecap="round" />
                    </g>
                  )}
                </svg>

                {zones.map(zone => (
                  <div
                    key={zone.key}
                    onMouseEnter={() => setHoveredZone(zone.key)}
                    onMouseLeave={() => setHoveredZone(null)}
                    onClick={() => document.getElementById(`input-${zone.key}`)?.focus()}
                    style={{
                      position: 'absolute',
                      top: zone.position.top,
                      left: zone.position.left,
                      transform: 'translate(-50%, -50%)',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: plis[zone.key] ? zone.color : 'white',
                      border: `3px solid ${zone.color}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: hoveredZone === zone.key ? `0 0 0 8px ${zone.color}40` : '0 2px 4px rgba(0,0,0,0.1)',
                      zIndex: hoveredZone === zone.key ? 10 : 1
                    }}
                  >
                    {plis[zone.key] && (
                      <div style={{
                        position: 'absolute',
                        top: '-30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: zone.color,
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}>
                        {plis[zone.key]} mm
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
                  💡 Comment mesurer ?
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.85rem', color: '#6b7280', lineHeight: '1.6' }}>
                  <li>Utilisez une pince à plis cutanés</li>
                  <li>Pincez fermement perpendiculairement</li>
                  <li>Mesurez à 1 cm du pouce et index</li>
                  <li>Attendez 2 secondes avant de lire</li>
                  <li>Répétez 2-3 fois pour précision</li>
                </ul>
              </div>
            </div>

            {/* Formulaire */}
            <div>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                  📝 Saisie des mesures
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Sexe</span>
                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#1f2937', textTransform: 'capitalize' }}>
                      {userInfo.sexe}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Âge</span>
                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#1f2937' }}>
                      {userInfo.dateNaissance ? new Date().getFullYear() - new Date(userInfo.dateNaissance).getFullYear() : 'N/A'} ans
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    📅 Date de mesure
                  </label>
                  <input
                    type="date"
                    value={dateMesure}
                    onChange={(e) => setDateMesure(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  {zones.map(zone => (
                    <div
                      key={zone.key}
                      onMouseEnter={() => setHoveredZone(zone.key)}
                      onMouseLeave={() => setHoveredZone(null)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '10px',
                        background: hoveredZone === zone.key ? `${zone.color}10` : '#f9fafb',
                        border: `2px solid ${plis[zone.key] ? zone.color : '#e5e7eb'}`,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: zone.color
                        }} />
                        <label style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937' }}>
                          {zone.label}
                        </label>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.75rem', margin: 0, paddingLeft: '1.5rem' }}>
                        {zone.desc}
                      </p>
                      <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                        <input
                          id={`input-${zone.key}`}
                          type="text"
                          inputMode="decimal"
                          value={plis[zone.key]}
                          onChange={(e) => handleInputChange(zone.key, e.target.value)}
                          placeholder="0.0"
                          style={{
                            width: '100%',
                            padding: '0.75rem 3rem 0.75rem 0.75rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        />
                        <span style={{
                          position: 'absolute',
                          right: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#6b7280',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          mm
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                {loading ? '⏳ Enregistrement...' : '💾 Enregistrer la mesure'}
              </button>
            </div>
          </div>
        )}

        {!userInfo && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏳</div>
            <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>Chargement...</p>
          </div>
        )}
      </div>
    </div>
  );
}