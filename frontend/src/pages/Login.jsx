import React, { useState } from 'react';
import { Package, Lock, User } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username === 'admin' && formData.password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = '/dashboard';
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg-dark)'
    }}>
      <div className="glass-card fade-in" style={{ padding: '3rem', width: '400px', textAlign: 'center' }}>
        <div style={{ 
          background: 'var(--secondary)', 
          width: '60px', 
          height: '60px', 
          borderRadius: '15px', 
          margin: '0 auto 1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Package size={32} color="#fff" />
        </div>
        
        <h1 style={{ marginBottom: '0.5rem' }}>Admin Portal</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Sub-Store Management System</p>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            padding: '10px', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            fontSize: '0.85rem',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Enter username" 
                style={{ paddingLeft: '40px' }}
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                placeholder="Enter password" 
                style={{ paddingLeft: '40px' }}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
            Secure Login
          </button>
        </form>

        <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          &copy; 2026 SAIL Sub-Store Management
        </p>
      </div>
    </div>
  );
};

export default Login;
