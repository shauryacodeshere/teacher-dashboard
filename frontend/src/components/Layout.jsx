import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Users, GraduationCap, LogOut } from 'lucide-react';

export default function Layout() {
  const { token, logout, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout">
      {/* Background Component */}
      <div className="app-background"></div>
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>
      <div className="glow-orb orb-3"></div>

      <aside className="sidebar">
        <h2 className="gradient-text" style={{ textAlign: 'left', marginBottom: '3rem' }}>InternTask</h2>
        
        <nav style={{ flex: 1 }}>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Home size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            Users Datatable
          </NavLink>
          <NavLink to="/teachers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <GraduationCap size={20} />
            Teachers Datatable
          </NavLink>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Logged in as:<br/>
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{user?.first_name} {user?.last_name}</span>
          </div>
          <button className="nav-link" onClick={logout} style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="glass-panel" style={{ padding: '2.5rem', minHeight: '100%' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
