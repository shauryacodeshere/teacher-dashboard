import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    university_name: '',
    gender: 'Male',
    year_joined: 2024
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  if (token) return <Navigate to="/users" replace />;

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Registration successful! Please sign in.');
        navigate('/login');
      } else {
        const errorMsg = JSON.stringify(data.messages) || data.message || 'Registration failed';
        toast.error(errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      toast.error('Network error, please try again.');
      setError('Network error, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="app-background"></div>
      <div className="auth-container">
        <div className="glass-panel auth-card" style={{ maxWidth: '600px' }}>
          <h2 className="gradient-text">Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="first_name" required onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="last_name" required onChange={handleChange} />
              </div>
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" required onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" required minLength={5} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>University Name</label>
              <input type="text" name="university_name" required onChange={handleChange} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Year Joined</label>
                <input type="number" name="year_joined" required value={formData.year_joined} onChange={handleChange} min={1900} max={2100} />
              </div>
            </div>
            
            {error && <div className="error-text" style={{marginBottom: '1rem'}}>{error}</div>}
            
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <Link to="/login" className="text-link">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </>
  );
}
