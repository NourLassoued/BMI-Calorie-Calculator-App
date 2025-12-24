import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Home, Target, Scale, TrendingUp, Activity, 
  Ruler, Utensils, ClipboardCheck, PieChart, 
  Settings, LogOut, UserCircle 
} from "lucide-react";
import "../../styles/dashboard.css";

export default function DashboardMenu() {
  const navigate = useNavigate();

  const menuItems = [
    { to: "/home", label: "Accueil", icon: <Home size={20}/> },
    { to: "/objectifs", label: "Objectifs", icon: <Target size={20}/> },
    { to: "/poids", label: "Historique Poids", icon: <Scale size={20}/> },
    { to: "/progression", label: "Progression", icon: <TrendingUp size={20}/> },
    { to: "/CaloriesIMC", label: "IMC & Macros", icon: <Activity size={20}/> },
    { to: "/mesures", label: "Mesures", icon: <Ruler size={20}/> },
    { to: "/nutrition", label: "Plan Nutrition", icon: <Utensils size={20}/> },
    { to: "/input", label: "Saisie Quotidienne", icon: <ClipboardCheck size={20}/> },
    { to: "/stats", label: "Statistiques", icon: <PieChart size={20}/> },
    { to: "/profile", label: "Profil", icon: <Settings size={20}/> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="dashboard-menu">
      <div className="dashboard-menu-header">
        <div className="dashboard-logo">
          <div className="logo-icon-container">
            <Activity className="logo-icon" size={28} color="#2563eb" />
          </div>
          <div className="dashboard-logo-text">
            <h2>FIT<span className="text-gradient">LIFE</span></h2>
            <p>User Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="dashboard-menu-navigation">
        <ul className="dashboard-menu-list">
          {menuItems.map((item) => (
            <li key={item.to} className="dashboard-menu-item">
              <NavLink
                to={item.to}
                className={({ isActive }) => `dashboard-menu-link ${isActive ? "active" : ""}`}
              >
                <span className="dashboard-menu-icon">{item.icon}</span>
                <span className="dashboard-menu-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="dashboard-menu-footer">
        <div className="user-info-card">
          <div className="user-avatar-container">
            <UserCircle size={32} color="#94a3b8" />
            <div className="status-indicator"></div>
          </div>
          <div className="user-details">
            <p className="user-name">Mon Compte</p>
            <p className="user-role">Athlète</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-button">
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}