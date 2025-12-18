import { Link,NavLink ,useNavigate} from "react-router-dom";
import "../../styles/dashboard.css";

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


        <li><Link to="/progression">📈Suivi de progression</Link></li>

        <li><Link to="/CaloriesIMC">⚖️IMC & Mesures</Link></li>
        <li><Link to="/mesures">📏 Mesures</Link></li>

        <li><Link to="/nutrition">🥗Plan nutrition</Link></li>

        <li><Link to="/input">📝Suivi</Link></li>

        <li><Link to="/stats">📊Statistiques globales</Link></li>

        <li><Link to="/profile">⚙️Profil</Link></li>
        


       <li>
  <button
    onClick={handleLogout}
    style={{
      background: 'none',
      border: 'none',
      color: '#rgba(255, 255, 255, 1);',
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
