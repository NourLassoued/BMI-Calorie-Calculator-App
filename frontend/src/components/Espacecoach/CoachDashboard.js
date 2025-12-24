import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, TrendingUp, Users, CheckCircle, Target, Activity, Mail, Phone, Ruler, Weight } from 'lucide-react';
import CoachMenu from "./CoachMenu";

export default function CoachDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [filterObjectif, setFilterObjectif] = useState('all');
  const [progressLoading, setProgressLoading] = useState(false);

  useEffect(() => { fetchAllUsers(); }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:5000/users/getAllUsers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Erreur');
      const data = await res.json();
      setUsers(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchUserProgress = async (userId) => {
    try {
      setProgressLoading(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`http://localhost:5000/mesures/getProgressionUtilisateur/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUserProgress(data);
    } catch (err) { setUserProgress(null); } finally { setProgressLoading(false); }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchUserProgress(user.id);
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterObjectif === 'all' || user.objectif === filterObjectif;
    return matchSearch && matchFilter;
  });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.actif).length,
    averageProgress: users.length > 0 
      ? Math.round(users.reduce((sum, u) => sum + (u.progressionPour || 0), 0) / users.length)
      : 0
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#020617',
      backgroundImage: 'radial-gradient(circle at 50% -20%, #1e293b 0%, #020617 80%)',
      padding: '2rem 2rem 2rem 300px',
      color: '#f8fafc',
      fontFamily: "'Inter', sans-serif"
    }}>
      <CoachMenu />

      {/* Header Section */}
      <header style={{ marginBottom: '2.5rem' }}>
      
      </header>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <StatCard title="Total Athlètes" value={stats.totalUsers} icon={<Users size={24}/>} color="#6366f1" />
        <StatCard title="Membres Actifs" value={stats.activeUsers} icon={<CheckCircle size={24}/>} color="#10b981" />
        <StatCard title="Progression Globale" value={`${stats.averageProgress}%`} icon={<TrendingUp size={24}/>} color="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* User Sidebar List */}
        <section style={glassContainer}>
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={20} color="#6366f1"/> Liste des membres
            </h2>
            
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={searchInputStyle}
              />
            </div>

            <select value={filterObjectif} onChange={(e) => setFilterObjectif(e.target.value)} style={selectStyle}>
              <option value="all">Tous les objectifs</option>
              <option value="prise_masse">Prise de masse</option>
              <option value="perte_poids">Perte de poids</option>
              <option value="performance">Performance</option>
            </select>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              {loading ? <div style={loaderStyle}>Chargement...</div> : 
                filteredUsers.map(user => (
                  <div key={user.id} onClick={() => handleSelectUser(user)} style={userCardStyle(selectedUser?.id === user.id)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600' }}>{user.nom}</span>
                      <ChevronRight size={16} color={selectedUser?.id === user.id ? '#fff' : '#475569'} />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>{user.email}</div>
                    <div style={badgeStyle(user.actif)}>{user.actif ? 'Actif' : 'Inactif'}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </section>

        {/* Detailed View */}
        <section style={glassContainer}>
          {selectedUser ? (
            <div style={{ padding: '2rem' }}>
              <div style={profileHeaderStyle}>
                <div style={avatarCircle}>{selectedUser.nom.charAt(0)}</div>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{selectedUser.nom}</h2>
                  <p style={{ color: '#94a3b8' }}>Inscrit le {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div style={infoGrid}>
                <InfoBox icon={<Mail size={16}/>} label="Email" value={selectedUser.email} />
                <InfoBox icon={<Phone size={16}/>} label="Mobile" value={selectedUser.telephone || '--'} />
                <InfoBox icon={<Target size={16}/>} label="Objectif" value={selectedUser.objectif} highlight />
                <InfoBox icon={<Ruler size={16}/>} label="Taille" value={`${selectedUser.taille} cm`} />
                <InfoBox icon={<Weight size={16}/>} label="Poids" value={`${selectedUser.poids} kg`} />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '2rem 0 1.5rem' }}>Historique des mesures</h3>
              
              {progressLoading ? <div style={loaderStyle}>Analyse des données...</div> :
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  {userProgress?.map((p, i) => <ProgressCard key={i} data={p} index={i} />)}
                </div>
              }
            </div>
          ) : (
            <div style={emptyStateStyle}>
              <div style={emptyIconCircle}><Users size={40} /></div>
              <h3>Sélectionnez un athlète</h3>
              <p>Cliquez sur un profil à gauche pour analyser ses données.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// --- Sous-composants stylisés ---

function StatCard({ title, value, icon, color }) {
  return (
    <div style={{
      ...glassContainer,
      padding: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
      borderBottom: `3px solid ${color}`
    }}>
      <div style={{ padding: '0.75rem', borderRadius: '12px', background: `${color}20`, color: color }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500' }}>{title}</p>
        <p style={{ fontSize: '1.75rem', fontWeight: '800' }}>{value}</p>
      </div>
    </div>
  );
}

function InfoBox({ icon, label, value, highlight }) {
  return (
    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.75rem', marginBottom: '4px' }}>
        {icon} {label.toUpperCase()}
      </div>
      <div style={{ fontWeight: '600', color: highlight ? '#818cf8' : '#f1f5f9' }}>{value}</div>
    </div>
  );
}

function ProgressCard({ data, index }) {
  return (
    <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#6366f1' }}>MESURE #{index + 1}</span>
        <span style={{ fontSize: '0.8rem', color: '#475569' }}>{new Date(data.dateMesure).toLocaleDateString()}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={miniMetric}>Poids: <b>{data.poids}kg</b></div>
        <div style={miniMetric}>Gras: <b>{data.pourcentageMasseGrasse}%</b></div>
        <div style={miniMetric}>IMC: <b>{data.imc?.toFixed(1)}</b></div>
        <div style={miniMetric}>Muscle: <b>{data.muscleMass}%</b></div>
      </div>
    </div>
  );
}

// --- Styles Objets (CSS-in-JS) ---

const glassContainer = {
  background: 'rgba(15, 23, 42, 0.8)',
  backdropFilter: 'blur(12px)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  overflow: 'hidden'
};

const searchInputStyle = {
  width: '100%',
  padding: '0.75rem 1rem 0.75rem 2.5rem',
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '12px',
  color: '#f8fafc',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border 0.2s',
  focus: { border: '1px solid #6366f1' }
};

const selectStyle = {
  width: '100%',
  padding: '0.75rem',
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '12px',
  color: '#f8fafc',
  cursor: 'pointer'
};

const userCardStyle = (isActive) => ({
  padding: '1rem',
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  background: isActive ? 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)' : 'rgba(255,255,255,0.03)',
  border: isActive ? '1px solid #818cf8' : '1px solid transparent',
  transform: isActive ? 'scale(1.02)' : 'scale(1)',
});

const badgeStyle = (isActive) => ({
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: '6px',
  fontSize: '0.7rem',
  fontWeight: '700',
  marginTop: '8px',
  textTransform: 'uppercase',
  background: isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
  color: isActive ? '#10b981' : '#ef4444',
});

const profileHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
  marginBottom: '2.5rem',
  paddingBottom: '1.5rem',
  borderBottom: '1px solid rgba(255,255,255,0.05)'
};

const avatarCircle = {
  width: '64px',
  height: '64px',
  borderRadius: '20px',
  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  fontWeight: '800',
  boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)'
};

const infoGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '1rem'
};

const miniMetric = {
  fontSize: '0.85rem',
  color: '#94a3b8',
  background: 'rgba(0,0,0,0.2)',
  padding: '8px',
  borderRadius: '8px'
};

const emptyStateStyle = {
  padding: '100px 40px',
  textAlign: 'center',
  color: '#64748b'
};

const emptyIconCircle = {
  width: '80px',
  height: '80px',
  margin: '0 auto 20px',
  background: 'rgba(255,255,255,0.03)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const loaderStyle = {
  textAlign: 'center',
  padding: '2rem',
  color: '#6366f1',
  fontWeight: '600'
};