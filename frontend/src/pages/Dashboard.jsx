import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, GraduationCap, Activity, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { API_URL } from '../config';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, teachers: 0, lastJoin: 'N/A', active: 0 });
  const [genderData, setGenderData] = useState([]);
  const [universityData, setUniversityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, logout, user } = useAuth();
  
  const PIE_COLORS = ['#58a6ff', '#ff69b4', '#ffa500'];

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
      fetch(`${API_URL}/teachers`, { headers: { 'Authorization': `Bearer ${token}` } })
    ])
    .then(async ([resUsers, resTeachers]) => {
      if (resUsers.status === 401 || resTeachers.status === 401) { logout(); return; }
      const usersData = await resUsers.json();
      const teachersData = await resTeachers.json();
      
      const latestUserDate = usersData.length ? new Date(Math.max(...usersData.map(u => new Date(u.created_at)))) : null;
      
      setStats({
        users: usersData.length || 0,
        teachers: teachersData.length || 0,
        lastJoin: latestUserDate ? latestUserDate.toLocaleDateString() : 'N/A',
        active: usersData.length
      });

      // Gender Pie Chart Calculation
      const gendersCount = teachersData.reduce((acc, t) => {
        acc[t.gender] = (acc[t.gender] || 0) + 1;
        return acc;
      }, {});
      setGenderData(Object.keys(gendersCount).map(k => ({ name: k, value: gendersCount[k] })));

      // University Distribution Bar Chart Calculation
      const uniCount = teachersData.reduce((acc, t) => {
        const uni = t.university_name || "Unknown";
        acc[uni] = (acc[uni] || 0) + 1;
        return acc;
      }, {});
      setUniversityData(Object.keys(uniCount).sort().map(k => ({ name: String(k), Teachers: uniCount[k] })));

      setLoading(false);
    })
    .catch(console.error);
  }, [token, logout]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Dashboard metrics...</div>;

  return (
    <div className="dashboard-container" style={{ animation: 'fade-in 0.6s ease-out' }}>
      <div className="header-bar">
        <div>
          <h2 style={{ fontSize: '2rem' }} className="gradient-text">Welcome back, {user?.first_name}! 👋</h2>
          <p style={{ color: 'var(--text-muted)' }}>Here is a live snapshot of your system analytics.</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card glass-panel interactive-hover">
          <div className="stat-icon" style={{ color: 'var(--primary-color)', background: 'rgba(88, 166, 255, 0.1)' }}>
            <Users size={28} />
          </div>
          <div className="stat-content">
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: 'var(--text-muted)' }}>Total Users</h3>
            <p className="stat-number">{stats.users}</p>
          </div>
        </div>

        <div className="stat-card glass-panel interactive-hover">
          <div className="stat-icon" style={{ color: '#ff69b4', background: 'rgba(255, 105, 180, 0.1)' }}>
            <GraduationCap size={28} />
          </div>
          <div className="stat-content">
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: 'var(--text-muted)' }}>Registered Teachers</h3>
            <p className="stat-number">{stats.teachers}</p>
          </div>
        </div>

        <div className="stat-card glass-panel interactive-hover">
          <div className="stat-icon" style={{ color: '#00fa9a', background: 'rgba(0, 250, 154, 0.1)' }}>
            <Activity size={28} />
          </div>
          <div className="stat-content">
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: 'var(--text-muted)' }}>Active Accounts</h3>
            <p className="stat-number">{stats.active}</p>
          </div>
        </div>

        <div className="stat-card glass-panel interactive-hover">
          <div className="stat-icon" style={{ color: '#ffa500', background: 'rgba(255, 165, 0, 0.1)' }}>
            <TrendingUp size={28} />
          </div>
          <div className="stat-content">
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: 'var(--text-muted)' }}>Latest Registration</h3>
            <p className="stat-number" style={{ fontSize: '1.2rem', marginTop: '10px' }}>{stats.lastJoin}</p>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Teacher Gender Distribution</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ background: 'var(--bg-color-2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Teachers by University</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={universityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                <YAxis allowDecimals={false} stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                <RechartsTooltip contentStyle={{ background: 'var(--bg-color-2)', border: '1px solid var(--border-color)', borderRadius: '8px' }} itemStyle={{ color: 'var(--primary-color)' }} />
                <Bar dataKey="Teachers" fill="url(#colorUv)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8a2be2" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
