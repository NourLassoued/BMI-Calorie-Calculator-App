import React, { useState, useEffect } from 'react';
import { BodyComponent } from "reactjs-human-body";

// --- Composant : Échelle de référence dynamique ---
const ReferenceScale = ({ gender, currentFat }) => {
  const isMale = gender === 'homme';
  const scales = isMale 
    ? [ { l: '6%', c: '#ef4444' }, { l: '14%', c: '#10b981' }, { l: '18%', c: '#3b82f6' }, { l: '25%', c: '#f59e0b' }, { l: '30%+', c: '#dc2626' } ]
    : [ { l: '14%', c: '#ef4444' }, { l: '21%', c: '#10b981' }, { l: '25%', c: '#3b82f6' }, { l: '32%', c: '#f59e0b' }, { l: '38%+', c: '#dc2626' } ];

  return (
    <div style={{ marginTop: '1.5rem', padding: '0 10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        {scales.map((s, i) => (
          <span key={i} style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '800' }}>{s.l}</span>
        ))}
      </div>
      <div style={{ display: 'flex', height: '10px', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#e2e8f0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
        {scales.map((s, i) => (
          <div key={i} style={{ flex: 1, backgroundColor: s.c, opacity: 0.8, borderRight: '2px solid white' }} />
        ))}
      </div>
    </div>
  );
};

export default function Body3DVisualizerEnhanced({ bodyFat, sexe }) {
  const [viewAngle, setViewAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  
  const fatPercentage = bodyFat > 1 ? bodyFat : bodyFat * 100;

  // 1. Logique de catégorie et couleurs
  const getBodyFatCategory = (fat, gender) => {
    const isMale = gender === 'homme';
    const thresholds = isMale ? [6, 14, 18, 25] : [14, 21, 25, 32];
    const categories = ['Essentiel', 'Athlète', 'Fitness', 'Acceptable', 'Obésité'];
    const colors = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#dc2626'];

    let index = thresholds.findIndex(t => fat < t);
    if (index === -1) index = 4;

    return { category: categories[index], color: colors[index], level: index };
  };

  const categoryInfo = getBodyFatCategory(fatPercentage, sexe);

  // 2. Morphologie Dynamique (Transformation du SVG)
  const getMorphologyStyle = (fat) => {
    const factor = Math.max(0, (fat - 10) / 100);
    const widthScale = 1 + (factor * 1.4); // Élargissement
    const heightScale = 1 - (factor * 0.15); // Tassement léger
    return {
      transform: `scaleX(${widthScale}) scaleY(${heightScale}) rotateY(${viewAngle}deg)`,
      transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
      transformOrigin: 'center bottom'
    };
  };

  // 3. Zones de coloration
  const getFatZones = (fat, gender) => {
    const zones = [];
    if (gender === 'homme') {
      if (fat >= 12) zones.push('abs', 'obliques');
      if (fat >= 18) zones.push('stomach', 'chest');
      if (fat >= 24) zones.push('back-lower', 'upper-leg-left', 'upper-leg-right', 'arm-left', 'arm-right');
    } else {
      if (fat >= 18) zones.push('gluteal', 'upper-leg-left', 'upper-leg-right');
      if (fat >= 24) zones.push('abs', 'obliques', 'stomach', 'chest');
      if (fat >= 30) zones.push('arm-left', 'arm-right', 'back-lower');
    }
    return zones;
  };

  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => setViewAngle(prev => (prev + 3) % 360), 50);
    return () => clearInterval(interval);
  }, [isRotating]);

  return (
    <div style={{ 
      maxWidth: '550px', margin: 'auto', background: '#ffffff', 
      padding: '2rem', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
      border: '1px solid #f1f5f9'
    }}>
      
      {/* Header Statistique */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
          Analyse de la Composition
        </h2>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 20px', borderRadius: '100px', 
          backgroundColor: `${categoryInfo.color}15`, color: categoryInfo.color,
          fontWeight: '800', fontSize: '1.1rem'
        }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: categoryInfo.color }} />
          {categoryInfo.category} • {fatPercentage.toFixed(1)}%
        </div>
      </div>

      {/* Visualisation Centrale */}
      <div style={{
        height: '450px', background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '24px', position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        border: '1px solid #e2e8f0', perspective: '1000px'
      }}>
        {/* Grille de sol 3D */}
        <div style={{ position: 'absolute', bottom: '0', width: '150%', height: '100px', background: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px', transform: 'rotateX(75deg)', opacity: 0.3 }} />

        {/* Modèle de corps */}
        <div style={getMorphologyStyle(fatPercentage)}>
          <BodyComponent
            gender={sexe === 'homme' ? 'male' : 'female'}
            color="#cbd5e1"
            highlightedColor={categoryInfo.color}
            parts={getFatZones(fatPercentage, sexe)}
            style={{ height: '380px', width: '250px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))' }}
          />
        </div>

        {/* Contrôles flottants */}
        
      </div>

      <ReferenceScale gender={sexe} currentFat={fatPercentage} />

      {/* Section Conseils Dynamiques */}
      <div style={{
        marginTop: '2rem', padding: '1.5rem',
        background: `linear-gradient(135deg, ${categoryInfo.color}10, transparent)`,
        borderRadius: '20px', border: `1px solid ${categoryInfo.color}20`
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: categoryInfo.color, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          💡 Recommandations Santé
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#334155', fontSize: '0.9rem', lineHeight: '1.7', fontWeight: '500' }}>
          {categoryInfo.level === 0 && (
            <>
              <li style={{ color: '#ef4444', fontWeight: '700' }}>⚠️ Attention : Taux de graisse extrêmement bas.</li>
              <li>Risque élevé de fatigue chronique et troubles hormonaux.</li>
              <li>Consultez un médecin pour vérifier vos fonctions métaboliques.</li>
            </>
          )}
          {categoryInfo.level === 1 && (
            <>
              <li>✅ Condition physique d'athlète de haut niveau.</li>
              <li>Assurez un sommeil de qualité (7-9h) pour la récupération.</li>
              <li>Surveillez l'apport en acides gras essentiels (Omega-3).</li>
            </>
          )}
          {categoryInfo.level === 2 && (
            <>
              <li>✅ Équilibre idéal pour la santé et la longévité.</li>
              <li>Combinez renforcement musculaire et cardio modéré.</li>
              <li>Niveau de graisse viscérale généralement très faible.</li>
            </>
          )}
          {categoryInfo.level === 3 && (
            <>
              <li>⚡ Forme correcte, mais des optimisations sont possibles.</li>
              <li>Réduisez les aliments ultra-transformés.</li>
              <li>Visez 150 min d'activité physique d'intensité modérée par semaine.</li>
            </>
          )}
          {categoryInfo.level === 4 && (
            <>
              <li style={{ color: '#dc2626', fontWeight: '700' }}>⚠️ Risques métaboliques accrus (cholestérol, glycémie).</li>
              <li>Priorisez la marche quotidienne (10k pas) avant les efforts intenses.</li>
              <li>Un suivi nutritionnel est fortement recommandé.</li>
            </>
          )}
        </ul>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8', marginTop: '1.5rem', fontStyle: 'italic' }}>
        * Cette simulation morphologique est basée sur des moyennes statistiques de distribution de masse grasse.
      </p>
    </div>
  );
}

const btnNavStyle = {
  padding: '6px 12px', borderRadius: '8px', border: 'none',
  background: 'white', color: '#64748b', fontSize: '0.75rem',
  fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};