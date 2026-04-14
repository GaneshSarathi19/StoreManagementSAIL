import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { User, Bell, Search } from 'lucide-react';

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <header className="top-header">
          <div className="search-bar glass-card" style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', width: '400px', height: '45px' }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              style={{ background: 'none', border: 'none', width: '100%', marginLeft: '10px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}>
              <Bell size={20} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '20px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>Admin User</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Store Manager</p>
              </div>
              <div className="glass-card" style={{ padding: '8px', borderRadius: '12px', background: 'var(--secondary)', display: 'flex' }}>
                <User size={20} color="#fff" />
              </div>
            </div>
          </div>
        </header>

        <div className="fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
