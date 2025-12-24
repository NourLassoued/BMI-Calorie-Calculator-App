import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

// --- COMPOSANT 3D : EFFET ÉNERGIE SPORT ---
function EnergyParticles(props) {
  const ref = useRef();
  
  // Augmentation du nombre de points pour un effet "vitesse" (10 000 points)
  const sphere = useMemo(() => {
    return random.inSphere(new Float32Array(10000), { radius: 1.5 });
  }, []);

  // Animation plus dynamique (accélération/pulsation)
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * 0.1;
    ref.current.rotation.y = t * 0.15;
    // Effet de pulsation légère
    ref.current.scale.setScalar(1 + Math.sin(t) * 0.05);
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#00d4ff" // Bleu électrique sport
          size={0.004}
          sizeAttenuation={true}
          depthWrite={false}
          blending={2} // Effet de brillance (Addictive Blending)
        />
      </Points>
    </group>
  );
}

export default function Hero() {
  return (
    <section id="accueil" style={{ 
      top:40,
      position: 'relative', 
      overflow: 'hidden', 
      background: 'radial-gradient(circle at center, #0a192f 0%, #050b18 100%)', 
      minHeight: '90vh', 
      display: 'flex', 
      alignItems: 'center',
      width: '100%' 
    }}>
      
      {/* 1. SCÈNE 3D : L'ÉNERGIE DU SPORT */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Canvas camera={{ position: [0, 0, 1] }}>
          <EnergyParticles />
        </Canvas>
      </div>

      {/* 2. CONTENU STRATÉGIQUE */}
      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        
        {/* Badge de Motivation */}
        <span style={{
          background: 'rgba(37, 99, 235, 0.2)',
          color: '#3b82f6',
          padding: '5px 15px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          border: '1px solid #2563eb',
          display: 'inline-block',
          marginBottom: '1rem'
        }}>
          Technologie Fitness 2025 🚀
        </span>

        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 7vw, 5rem)', 
          fontWeight: '900', 
          lineHeight: '1.1',
          color: 'white',
          marginBottom: '1.5rem',
          textTransform: 'uppercase',
          fontStyle: 'italic' // Donne un look "vitesse/sport"
        }}>
          Transformez votre <br/> 
          <span style={{ 
            color: 'transparent', 
            WebkitTextStroke: '1px #2563eb',
            textShadow: '0 0 15px #2563eb'
          }}>Potentiel en Force</span>
        </h1>
        
        <p style={{ 
          maxWidth: '650px', 
          margin: '0 auto 3rem', 
          fontSize: '1.1rem', 
          color: '#cbd5e1',
          fontWeight: '300'
        }}>
          Rejoignez l'élite. Coaching personnalisé, suivi biométrique et programmes 
          d'entraînement haute intensité adaptés à votre morphologie.
        </p>

        {/* LIENS VERS LES SECTIONS SPORTIVES */}
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          
          <a href="#programmes-entrainement" className="btne btne-primary" style={{ 
            padding: "1.2rem 2.5rem", 
            borderRadius: '0', // Look plus agressif/sport
            clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)', // Forme parallélogramme sport
            fontSize: '1rem',
            background: '#2563eb',
            fontWeight: 'bold'
          }}>
            Voir les Programmes
          </a>
          
          <a href="#calculateur-bmi" className="btne" style={{ 
            padding: "1.2rem 2.5rem", 
            fontSize: '1rem',
            background: "transparent", 
            border: '2px solid white',
            color: 'white',
            fontWeight: 'bold',
            transition: '0.3s'
          }}
          onMouseOver={(e) => e.target.style.background = 'white'}
          onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            Calculer mes Macros
          </a>

        </div>

        {/* Stats Rapides (Optionnel pour le look) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '4rem', opacity: 0.7 }}>
            <div>
                <h4 style={{ color: '#2563eb', fontSize: '1.5rem', margin: 0 }}>50k+</h4>
                <small style={{ color: 'white' }}>Athlètes</small>
            </div>
            <div>
                <h4 style={{ color: '#2563eb', fontSize: '1.5rem', margin: 0 }}>120+</h4>
                <small style={{ color: 'white' }}>Coachs</small>
            </div>
            <div>
                <h4 style={{ color: '#2563eb', fontSize: '1.5rem', margin: 0 }}>98%</h4>
                <small style={{ color: 'white' }}>Réussite</small>
            </div>
        </div>
      </div>
    </section>
  );
}