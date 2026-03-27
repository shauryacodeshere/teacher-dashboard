import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users as UsersIcon, Search, Download, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { API_URL } from '../config';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, logout } = useAuth();

  useEffect(() => {
    fetch(`${API_URL}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => {
      if (!r.ok) {
         if (r.status === 401) logout();
         throw new Error('Failed to fetch data');
      }
      return r.json();
    })
    .then(data => { setUsers(data); setLoading(false); })
    .catch(e => { setError(e.message); setLoading(false); });
  }, [token, logout]);

  const handleExportCSV = () => {
    if (!users.length) return toast.info("No data to export");
    const headers = ["ID", "First Name", "Last Name", "Email", "Joined Date"];
    const csvContent = [
      headers.join(","),
      ...users.map(u => [u.id, `"${u.first_name}"`, `"${u.last_name}"`, u.email, u.created_at].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "users_export.csv";
    link.click();
    toast.success("Users CSV Exported!");
  };

  const openUserModal = (u) => {
    setSelectedUser(u);
    setEditFormData({ first_name: u.first_name, last_name: u.last_name, email: u.email });
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API_URL}/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("User gracefully updated!");
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...editFormData } : u));
      setSelectedUser({ ...selectedUser, ...editFormData });
      setIsEditing(false);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Permanently delete this user?")) return;
    try {
      const res = await fetch(`${API_URL}/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("User brutally eradicated from the database.");
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setSelectedUser(null);
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading) return <div>Loading users datatable...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <>
      <div className="header-bar">
        <div>
          <h2><UsersIcon size={24} style={{ verticalAlign: 'middle', marginRight: '10px', color: 'var(--primary-color)' }} /> User Directory</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Comprehensive list of all registered auth_users.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="search-bar-container">
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search users..." 
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
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Status</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(u => `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(u => (
              <tr key={u.id} className="interactive-hover" onClick={() => openUserModal(u)} style={{ cursor: 'pointer' }}>
                <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{u.id}</td>
                <td style={{ fontWeight: 500 }}>{u.first_name} {u.last_name}</td>
                <td><span className="badge" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>{u.email}</span></td>
                <td><span className="badge">Active</span></td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Profile Card */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedUser(null)}><X size={24} /></button>
            <h2 className="gradient-text" style={{ textAlign: 'left', marginBottom: '1rem' }}>
              {isEditing ? 'Edit Profile' : 'User Profile'}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, max-content) 1fr', gap: '10px', marginTop: '1.5rem',  color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text-main)', alignSelf: 'center' }}>ID:</strong> <span style={{ padding: '8px 0' }}>#{selectedUser.id}</span>
              
              <strong style={{ color: 'var(--text-main)', alignSelf: 'center' }}>First Name:</strong> 
              {isEditing ? <input className="search-input" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '4px' }} value={editFormData.first_name} onChange={e => setEditFormData({...editFormData, first_name: e.target.value})} /> : <span style={{ padding: '8px 0' }}>{selectedUser.first_name}</span>}
              
              <strong style={{ color: 'var(--text-main)', alignSelf: 'center' }}>Last Name:</strong> 
              {isEditing ? <input className="search-input" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '4px' }} value={editFormData.last_name} onChange={e => setEditFormData({...editFormData, last_name: e.target.value})} /> : <span style={{ padding: '8px 0' }}>{selectedUser.last_name}</span>}
              
              <strong style={{ color: 'var(--text-main)', alignSelf: 'center' }}>Email:</strong> 
              {isEditing ? <input className="search-input" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '4px' }} type="email" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} /> : <span style={{ padding: '8px 0' }}>{selectedUser.email}</span>}
              
              <strong style={{ color: 'var(--text-main)', paddingTop: '8px' }}>Status:</strong> <span className="badge" style={{width: 'max-content', marginTop: '8px'}}>Active Account</span>
              <strong style={{ color: 'var(--text-main)', paddingTop: '8px' }}>Joined On:</strong> <span style={{ padding: '8px 0' }}>{new Date(selectedUser.created_at).toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '2.5rem' }}>
              {isEditing ? (
                <>
                  <button className="btn" style={{ background: '#00fa9a', color: '#000' }} onClick={handleUpdate}>Save Changes</button>
                  <button className="btn" style={{ background: 'transparent', border: '1px solid var(--border-color)' }} onClick={() => setIsEditing(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="btn" onClick={() => setIsEditing(true)}>Edit User</button>
                  <button className="btn" style={{ background: 'var(--error)' }} onClick={handleDelete}>Delete Admin</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
