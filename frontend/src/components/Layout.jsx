import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search, X } from 'lucide-react';
import axios from 'axios';

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      try {
        const [materialsRes, employeesRes, categoriesRes, issuesRes] = await Promise.all([
          axios.get('/api/materials'),
          axios.get('/api/employees'),
          axios.get('/api/categories'),
          axios.get('/api/issues')
        ]);

        const results = [];

        // Search materials
        const filteredMaterials = materialsRes.data
          .filter(m =>
            m.material_name.toLowerCase().includes(query.toLowerCase()) ||
            m.material_code.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5)
          .map(m => ({ type: 'material', id: m.id, name: m.material_name, code: m.material_code, qty: m.remaining_qty }));
        results.push(...filteredMaterials);

        // Search employees
        const filteredEmployees = employeesRes.data
          .filter(e =>
            e.name.toLowerCase().includes(query.toLowerCase()) ||
            e.emp_id.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5)
          .map(e => ({ type: 'employee', id: e.emp_id, name: e.name, department: e.department }));
        results.push(...filteredEmployees);

        // Search categories
        const filteredCategories = categoriesRes.data
          .filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
          .map(c => ({ type: 'category', id: c.id, name: c.name }));
        results.push(...filteredCategories);

        // Search issues
        const filteredIssues = issuesRes.data
          .filter(i =>
            i.material_name.toLowerCase().includes(query.toLowerCase()) ||
            i.emp_id.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5)
          .map(i => ({ type: 'issue', id: i.id, name: `${i.material_name} (${i.quantity} qty)`, emp: i.emp_id }));
        results.push(...filteredIssues);

        setSearchResults(results.slice(0, 15));
        setShowResults(true);
      } catch (err) {
        console.error('Search error:', err);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const checkLowStock = async () => {
        try {
          const res = await axios.get('/api/materials');
          const lowStock = res.data.filter(m => m.remaining_qty < 10);
          if (lowStock.length > 0) {
            setNotifications([{
              id: 1,
              type: 'warning',
              message: `${lowStock.length} materials have low stock`
            }]);
          }
        } catch (err) {
          console.error('Notification error:', err);
        }
      };
      checkLowStock();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getSearchResultIcon = (type) => {
    const icons = {
      material: '📦',
      employee: '👤',
      category: '📂',
      issue: '📤'
    };
    return icons[type] || '📌';
  };

  const getSearchResultInfo = (result) => {
    switch (result.type) {
      case 'material':
        return `${result.code} • Stock: ${result.qty}`;
      case 'employee':
        return `ID: ${result.id} • Dept: ${result.department}`;
      case 'category':
        return 'Category';
      case 'issue':
        return `Emp: ${result.emp}`;
      default:
        return '';
    }
  };
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <header className="top-header">
          <div style={{ position: 'relative' }}>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', width: '400px', height: '45px' }}>
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Search materials by name or code..." 
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ background: 'none', border: 'none', width: '100%', marginLeft: '10px', color: 'var(--text-main)' }}
              />
            </div>
            {showResults && searchResults.length > 0 && (
              <div className="glass-card" style={{ position: 'absolute', top: '55px', left: 0, width: '100%', maxHeight: '400px', overflowY: 'auto', zIndex: 100 }}>
                {searchResults.map((result, idx) => (
                  <div key={idx} style={{ padding: '12px 1rem', borderBottom: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ fontSize: '1.2rem' }}>{getSearchResultIcon(result.type)}</span>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{result.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{getSearchResultInfo(result)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <div 
                className="glass-card" 
                style={{ padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} color={notifications.length > 0 ? '#ef4444' : 'var(--text-main)'} />
                {notifications.length > 0 && (
                  <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {notifications.length}
                  </div>
                )}
              </div>
              {showNotifications && (
                <div className="glass-card" style={{ position: 'absolute', top: '50px', right: 0, width: '350px', maxHeight: '400px', overflowY: 'auto', zIndex: 100 }}>
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div key={notif.id} style={{ padding: '12px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{notif.message}</div>
                        <button onClick={() => removeNotification(notif.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                          <X size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No notifications</div>
                  )}
                </div>
              )}
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
