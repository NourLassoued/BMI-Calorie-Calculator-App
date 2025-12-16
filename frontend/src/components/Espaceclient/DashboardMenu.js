import React from "react";
import { Link,NavLink ,useNavigate} from "react-router-dom";
import "../../styles/dashboard.css";
import {logout} from "../../service/apiAuthUser";

export default function DashboardMenu()
 {
  const navigate= useNavigate();
  const handleLogout=()=>{
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    navigate('/*');
  }
  return (
    <aside className="dashboard-menu">
      <h2 className="menu-title">🏋️ Espace Fitness</h2>

      <ul>
        <li><NavLink to="/home">🏠 Accueil</NavLink></li>

        <li><NavLink to="/objectifs">🎯 Objectifs</NavLink></li>

<li><Link to="/poids">⚖️ Poids</Link></li>


        <li className="menu-section">📈 Progression</li>
        <li><Link to="/progression">Suivi de progression</Link></li>

        <li className="menu-section">⚖️ Indices</li>
        <li><Link to="/indices">IMC & Mesures</Link></li>

        <li className="menu-section">🥗 Nutrition</li>
        <li><Link to="/nutrition">Plan nutrition</Link></li>

        <li className="menu-section">📝 Suivi</li>
        <li><Link to="/input">Ajouter une donnée</Link></li>

        <li className="menu-section">📊 Statistiques</li>
        <li><Link to="/stats">Statistiques globales</Link></li>

        <li className="menu-section">⚙️ Compte</li>
        <li><Link to="/profile">Profil</Link></li>
       <li>
  <button
    onClick={handleLogout}
    style={{
      background: 'none',
      border: 'none',
      color: '#ef4444',
      cursor: 'pointer',
      fontSize: '1rem',
      padding: 0
    }}
  >
    Déconnexion
  </button>
</li>

      </ul>
    </aside>
  );
}
