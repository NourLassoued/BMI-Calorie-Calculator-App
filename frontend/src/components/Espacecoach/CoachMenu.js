import { NavLink, useNavigate } from "react-router-dom";
import {  LayoutDashboard,  Users, TrendingUp,  Notebook as FileText, MessageSquare, Mail,  Dumbbell, Settings, 
  LogOut,  UserCircle,Calendar } from "lucide-react";
import "../../styles/coach-menu.css";

export default function CoachMenu() {
  const navigate = useNavigate();

  const menuItems = [
    { to: "/coach/dashboard", label: "Tableau de bord", icon: <LayoutDashboard size={20}/> },
    { to: "/calendrier", label: "Calendrier", icon: <Calendar size={20}/> },
    { to: "/coach/utilisateurs", label: "Utilisateurs", icon: <Users size={20}/> },
    { to: "/coach/progression", label: "Progression", icon: <TrendingUp size={20}/> },
    { to: "/coach/plans", label: "Plans nutrition", icon: <FileText size={20}/> },
    { to: "/coach/demandes", label: "Demandes", icon: <MessageSquare size={20}/> },
    { to: "/coach/messages", label: "Messages", icon: <Mail size={20}/> },
    { to: "/coach/seances", label: "Séances", icon: <Dumbbell size={20}/> },
    { to: "/coach/parametres", label: "Paramètres", icon: <Settings size={20}/> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="coach-menu">
      <div className="coach-menu-header">
        <div className="coach-logo">
          <div className="logo-icon-container">
            <Dumbbell className="logo-icon" size={28} color="#6366f1" />
          </div>
          <div className="coach-logo-text">
            <h2>COACH<span className="text-gradient">PRO</span></h2>
            <p>Performance Hub</p>
          </div>
        </div>
      </div>

      <nav className="coach-menu-navigation">
        <ul className="coach-menu-list">
          {menuItems.map((item) => (
            <li key={item.to} className="coach-menu-item">
              <NavLink
                to={item.to}
                className={({ isActive }) => `coach-menu-link ${isActive ? "active" : ""}`}
              >
                <span className="coach-menu-icon">{item.icon}</span>
                <span className="coach-menu-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="coach-menu-footer">
        <div className="coach-info-card">
          <div className="coach-avatar-container">
            <UserCircle size={32} color="#94a3b8" />
            <div className="status-indicator"></div>
          </div>
          <div className="coach-details">
            <p className="coach-name">Alex Smith</p>
            <p className="coach-role">Head Coach</p>
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