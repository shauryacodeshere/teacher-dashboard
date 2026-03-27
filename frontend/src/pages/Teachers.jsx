import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Search, Download, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { API_URL } from '../config';

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, logout } = useAuth();

  useEffect(() => {
    fetch(`${API_URL}/teachers`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => {
      if (!r.ok) {
         if (r.status === 401) logout();
         throw new Error('Failed to fetch data');
      }
      return r.json();
    })
    .then(data => { setTeachers(data); setLoading(false); })
    .catch(e => { setError(e.message); setLoading(false); });
  }, [token, logout]);

  const handleExportCSV = () => {
    if (!teachers.length) return toast.info("No data to export");
    const headers = ["ID", "First Name", "Last Name", "University", "Gender", "Year Joined", "Email"];
    const csvContent = [
      headers.join(","),
      ...teachers.map(t => [t.id, `"${t.first_name}"`, `"${t.last_name}"`, `"${t.university_name}"`, t.gender, t.year_joined, t.email].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "teachers_export.csv";
    link.click();
    toast.success("Teachers CSV Exported!");
  };

  if (loading) return <div>Loading teachers datatable...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <>
      <div className="header-bar">
        <div>
          <h2><GraduationCap size={24} style={{ verticalAlign: 'middle', marginRight: '10px', color: 'var(--primary-color)' }} /> Teachers Database</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Comprehensive database linked with auth_user table.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="search-bar-container">
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search teachers..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={handleExportCSV} className="btn" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}>
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Teacher Name</th>
              <th>University</th>
              <th>Gender</th>
              <th>Year Joined</th>
              <th>Email Linked</th>
            </tr>
          </thead>
          <tbody>
            {teachers
              .filter(t => `${t.first_name} ${t.last_name} ${t.email} ${t.university_name}`.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(t => (
              <tr key={t.id} className="interactive-hover" onClick={() => setSelectedTeacher(t)} style={{ cursor: 'pointer' }}>
                <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{t.id}</td>
                <td style={{ fontWeight: 500 }}>{t.first_name} {t.last_name}</td>
                <td>{t.university_name}</td>
                <td>
                  <span className="badge" style={{ 
                    background: t.gender === 'Female' ? 'rgba(255, 105, 180, 0.15)' : 'rgba(88, 166, 255, 0.15)',
                    color: t.gender === 'Female' ? '#ff69b4' : 'var(--primary-color)'
                  }}>
                    {t.gender}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{t.year_joined}</td>
                <td style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{t.email}</td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No teachers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Profile Card */}
      {selectedTeacher && (
        <div className="modal-overlay" onClick={() => setSelectedTeacher(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTeacher(null)}><X size={24} /></button>
            <h2 className="gradient-text" style={{ textAlign: 'left', marginBottom: '1rem' }}>Teacher Profile view</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '10px', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text-main)' }}>ID:</strong> <span>#{selectedTeacher.id}</span>
              <strong style={{ color: 'var(--text-main)' }}>Name:</strong> <span>{selectedTeacher.first_name} {selectedTeacher.last_name}</span>
              <strong style={{ color: 'var(--text-main)' }}>Email:</strong> <span>{selectedTeacher.email}</span>
              
              <div style={{ gridColumn: '1 / -1', height: '1px', background: 'var(--border-color)', margin: '10px 0' }}></div>
              
              <strong style={{ color: 'var(--text-main)' }}>University:</strong> <span>{selectedTeacher.university_name}</span>
              <strong style={{ color: 'var(--text-main)' }}>Gender:</strong> <span>{selectedTeacher.gender}</span>
              <strong style={{ color: 'var(--text-main)' }}>Joined Cohort:</strong> <span>{selectedTeacher.year_joined}</span>
            </div>
            
            <button className="btn" style={{ marginTop: '2.5rem' }} onClick={() => setSelectedTeacher(null)}>Close View</button>
          </div>
        </div>
      )}
    </>
  );
}
