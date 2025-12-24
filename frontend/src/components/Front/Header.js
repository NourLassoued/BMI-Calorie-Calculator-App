import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      background: 'rgba(5, 11, 24, 0.85)', 
      backdropFilter: 'blur(12px)',       
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.5rem 0'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <nav style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          
          {/* LOGO */}
          <Link to="/" style={{
            fontSize: '1.6rem',
            fontWeight: '900',
            color: 'white',
            textDecoration: 'none',
            letterSpacing: '1.5px',
            textTransform: 'uppercase'
          }}>
             Fit<span style={{ color: '#2563eb' }}> Tracker</span>
          </Link>

          {/* NAVIGATION CENTRALE */}
          <ul style={{ 
            display: 'flex', 
            listStyle: 'none', 
            gap: '1.5rem',
            margin: 0,
            padding: 0
          }}>
            {['Programmes', 'Exercices', 'Nutrition', 'Communauté'].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: '0.3s'
                }}
                onMouseOver={(e) => e.target.style.color = '#2563eb'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          {/* ACTIONS : CALENDRIER + CONNEXION + INSCRIPTION */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            
            {/* ICONE CALENDRIER SVG */}
            <div style={{ position: 'relative', cursor: 'pointer', display: 'flex' }} title="Planning">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-8px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
              }}>
                3
              </span>
            </div>

            {/* LIEN CONNEXION */}
            <Link to="/login" style={{ 
              color: 'white',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              transition: '0.3s'
            }}
            onMouseOver={(e) => e.target.style.color = '#2563eb'}
            onMouseOut={(e) => e.target.style.color = 'white'}
            >
              Connexion
            </Link>

            {/* BOUTON INSCRIPTION (STYLE BISEAUTÉ SPORT) */}
            <Link to="/Inscription" style={{ 
              background: '#2563eb',
              color: 'white',
              padding: '0.6rem 1.4rem',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              clipPath: 'polygon(12% 0, 100% 0, 88% 100%, 0% 100%)',
              transition: '0.3s',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
            }}
            onMouseOver={(e) => {
                e.target.style.background = '#1d4ed8';
                e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
                e.target.style.background = '#2563eb';
                e.target.style.transform = 'scale(1)';
            }}
            >
              S'inscrire
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}