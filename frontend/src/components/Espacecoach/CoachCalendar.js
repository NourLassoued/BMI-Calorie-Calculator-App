import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Edit2, Trash2, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import CoachMenu from './CoachMenu';

export default function CoachCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState('calendar');

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    dateRendez: '',
    heure: '',
    lieu: '',
    type: 'consultation',
    statut: 'planifie'
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:5000/appointments/getAllAppointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Erreur');
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateClick = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setFormData(prev => ({
      ...prev,
      dateRendez: date.toISOString().split('T')[0]
    }));
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titre || !formData.dateRendez || !formData.heure) {
      toast.error('❌ Remplissez les champs requis');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `http://localhost:5000/appointments/${editingId}`
        : 'http://localhost:5000/appointments/create';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Erreur');
      toast.success(editingId ? '✅ RDV modifié' : '✅ RDV créé');
      fetchAppointments();
      handleCloseModal();
    } catch (err) {
      toast.error('❌ Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`http://localhost:5000/appointments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✅ RDV supprimé');
      fetchAppointments();
    } catch (err) {
      toast.error('❌ Erreur');
    }
  };

  const handleEdit = (apt) => {
    setFormData({
      titre: apt.titre,
      description: apt.description || '',
      dateRendez: apt.dateRendez,
      heure: apt.heure,
      lieu: apt.lieu || '',
      type: apt.type || 'consultation',
      statut: apt.statut || 'planifie'
    });
    setEditingId(apt.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      titre: '', description: '', dateRendez: '', heure: '', lieu: '', type: 'consultation', statut: 'planifie'
    });
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => {
    let day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Ajustement pour que la semaine commence le Lundi
  };

  const getAppointmentsForDate = (day) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return appointments.filter(apt => apt.dateRendez === dateStr);
  };

  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  // Styles Partagés
  const glassStyle = {
    background: 'rgba(30, 41, 59, 0.5)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
  };

  const neonGradient = 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a', // Slate-900 pour matcher le dashboard
      padding: '2rem',
      marginLeft: '280px', // Correspond à la largeur de ton menu + gap
      color: '#f8fafc',
      fontFamily: "'Inter', sans-serif"
    }}>
      <CoachMenu/>
      {/* Header Section */}
      <div style={{
        ...glassStyle,
        padding: '2.5rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: 0, letterSpacing: '-1px' }}>
            Mon <span style={{ background: neonGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Calendrier</span>
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Gérez vos sessions et rendez-vous clients</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            background: neonGradient,
            border: 'none',
            padding: '0.8rem 1.5rem',
            borderRadius: '12px',
            color: 'white',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
          }}
        >
          <Plus size={20} /> Nouveau RDV
        </button>
      </div>

      {/* View Toggle Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        {['calendar', 'list'].map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              padding: '0.6rem 1.2rem',
              background: viewMode === mode ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              border: `1px solid ${viewMode === mode ? '#6366f1' : 'rgba(148, 163, 184, 0.2)'}`,
              borderRadius: '10px',
              color: viewMode === mode ? '#818cf8' : '#94a3b8',
              fontWeight: '600',
              cursor: 'pointer',
              transition: '0.2s'
            }}
          >
            {mode === 'calendar' ? 'Vue Calendrier' : 'Vue Liste'}
          </button>
        ))}
      </div>

      {viewMode === 'calendar' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
          
          {/* Main Calendar Card */}
          <div style={{ ...glassStyle, padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                      style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}>
                <ChevronLeft size={24} />
              </button>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', textTransform: 'capitalize' }}>{monthName}</h2>
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                      style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}>
                <ChevronRight size={24} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} style={{ textAlign: 'center', color: '#64748b', fontWeight: '600', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{day}</div>
              ))}
              {days.map((day, idx) => {
                const dayAppointments = day ? getAppointmentsForDate(day) : [];
                const isToday = day && new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                
                return (
                  <div key={idx} onClick={() => day && handleDateClick(day)}
                    style={{
                      minHeight: '100px',
                      background: isToday ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: isToday ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '8px',
                      cursor: day ? 'pointer' : 'default',
                      transition: '0.2s transform',
                    }}
                    onMouseEnter={(e) => day && (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => day && (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    {day && (
                      <>
                        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: isToday ? '#818cf8' : '#94a3b8' }}>{day}</span>
                        <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {dayAppointments.slice(0, 2).map(apt => (
                            <div key={apt.id} style={{ 
                              fontSize: '0.65rem', 
                              background: '#6366f1', 
                              color: 'white', 
                              padding: '2px 6px', 
                              borderRadius: '4px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {apt.heure} {apt.titre}
                            </div>
                          ))}
                          {dayAppointments.length > 2 && <span style={{fontSize: '0.6rem', color: '#64748b'}}>+{dayAppointments.length - 2} autres</span>}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar: Next Appointments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ ...glassStyle, padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={18} color="#818cf8" /> Prochains RDV
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {appointments.slice(0, 4).map(apt => (
                  <div key={apt.id} style={{ borderLeft: '3px solid #6366f1', paddingLeft: '12px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '0 8px 8px 0' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{apt.titre}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                      {new Date(apt.dateRendez).toLocaleDateString()} • {apt.heure}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* List View */
        <div style={{ ...glassStyle, padding: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#64748b', fontSize: '0.85rem' }}>
                <th style={{ padding: '1rem' }}>TITRE</th>
                <th>DATE & HEURE</th>
                <th>TYPE</th>
                <th>STATUT</th>
                <th style={{ textAlign: 'right', paddingRight: '1rem' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(apt => (
                <tr key={apt.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>{apt.titre}</td>
                  <td style={{ color: '#94a3b8' }}>{apt.dateRendez} à {apt.heure}</td>
                  <td><span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px' }}>{apt.type}</span></td>
                  <td>
                    <span style={{ color: apt.statut === 'planifie' ? '#fbbf24' : '#10b981' }}>● {apt.statut}</span>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '1rem' }}>
                    <button onClick={() => handleEdit(apt)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginRight: '10px' }}><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(apt.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Glassmorphic Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ ...glassStyle, background: '#1e293b', width: '100%', maxWidth: '500px', padding: '2rem', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0 }}>{editingId ? 'Modifier RDV' : 'Nouveau RDV'}</h2>
              <X onClick={handleCloseModal} style={{ cursor: 'pointer' }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.2rem' }}>
              <input type="text" name="titre" value={formData.titre} onChange={handleInputChange} placeholder="Titre de la séance" 
                     style={{ width: '100%', padding: '0.8rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white' }} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="date" name="dateRendez" value={formData.dateRendez} onChange={handleInputChange} 
                       style={{ padding: '0.8rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white' }} />
                <input type="time" name="heure" value={formData.heure} onChange={handleInputChange} 
                       style={{ padding: '0.8rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white' }} />
              </div>

              <select name="type" value={formData.type} onChange={handleInputChange} 
                      style={{ padding: '0.8rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white' }}>
                <option value="consultation">Consultation</option>
                <option value="seance">Séance Sportive</option>
                <option value="evaluation">Évaluation Physique</option>
              </select>

              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Notes optionnelles..." 
                        style={{ padding: '0.8rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white', minHeight: '80px' }} />

              <button type="submit" disabled={loading} style={{ background: neonGradient, color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>
                {loading ? 'Traitement...' : 'Confirmer le rendez-vous'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}