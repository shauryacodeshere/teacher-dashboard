import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, token } = useAuth();
  const navigate = useNavigate();

  if (token) {
    return <Navigate to="/users" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Welcome back, ${data.user.first_name}!`);
        login(data.token, data.user);
        navigate('/users');
      } else {
        const errorMsg = data.messages?.error || data.message || (typeof data.error === 'string' ? data.error : 'Invalid credentials');
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
        <div className="glass-panel auth-card">
          <h2 className="gradient-text">Welcome Back</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            
            {error && <div className="error-text" style={{marginBottom: '1rem'}}>{error}</div>}
            
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <Link to="/register" className="text-link">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </>
  );
}
