import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  Users,
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMaterials: 0,
    lowStockCount: 0,
    totalIssued: 0,
    totalEmployees: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [recentIssues, setRecentIssues] = useState([]);
  const lowStockThreshold = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialsRes, issuesRes, employeesRes] = await Promise.all([
          axios.get('/api/materials'),
          axios.get('/api/issues'),
          axios.get('/api/employees')
        ]);

        const materials = materialsRes.data;
        const lowStock = materials.filter(m => m.remaining_qty < lowStockThreshold).length;

        setStats({
          totalMaterials: materials.length,
          lowStockCount: lowStock,
          totalIssued: issuesRes.data.length,
          totalEmployees: employeesRes.data.length
        });

        setRecentIssues(issuesRes.data.slice(0, 5));
      } catch (err) {
        console.error("Error fetching dashboard data", err);
        setError('Failed to load dashboard data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Dashboard...</div>;
  if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>{error}</div>;

  return (
    <div className="dashboard-page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.2rem' }}>Quick Issue by Category</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { name: 'Cartridges', color: '#3b82f6', icon: <Package size={24} /> },
            { name: 'Toners', color: '#a855f7', icon: <Package size={24} /> },
            { name: 'Stationaries', color: '#10b981', icon: <Package size={24} /> }
          ].map((cat) => (
            <Link 
              key={cat.name}
              to={`/issue?category=${cat.name}`}
              className="glass-card" 
              style={{ 
                padding: '1.5rem', 
                textDecoration: 'none', 
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                border: `1px solid ${cat.color}33`,
                transition: 'transform 0.2s, border-color 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = cat.color;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = `${cat.color}33`;
              }}
            >
              <div style={{ 
                background: `${cat.color}22`, 
                padding: '12px', 
                borderRadius: '12px',
                color: cat.color,
                display: 'flex'
              }}>
                {cat.icon}
              </div>
              <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{cat.name}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click to issue item</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="stat-label">Total Materials</div>
            <Package size={20} color="var(--secondary)" />
          </div>
          <div className="stat-value">{stats.totalMaterials}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '5px' }}>
            <TrendingUp size={14} /> +2% from last month
          </div>
        </div>

        <div className="stat-card glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="stat-label">Low Stock Alert</div>
            <AlertTriangle size={20} color={stats.lowStockCount > 0 ? "var(--danger)" : "var(--success)"} />
          </div>
          <div className="stat-value" style={{ color: stats.lowStockCount > 0 ? "var(--danger)" : "inherit" }}>
            {stats.lowStockCount}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Threshold: {lowStockThreshold} units</p>
        </div>

        <div className="stat-card glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="stat-label">Items Issued</div>
            <ArrowRight size={20} color="#a855f7" />
          </div>
          <div className="stat-value">{stats.totalIssued}</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total lifetime issues</p>
        </div>

        <div className="stat-card glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="stat-label">Registered Employees</div>
            <Users size={20} color="#10b981" />
          </div>
          <div className="stat-value">{stats.totalEmployees}</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active in system</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Recent Issued Items</h3>
            <Link to="/reports" style={{ color: 'var(--secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>View All</Link>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Employee</th>
                  <th>Qty</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentIssues.map(issue => (
                  <tr key={issue.id}>
                    <td>
                      <div>{issue.material_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{issue.material_code}</div>
                    </td>
                    <td>{issue.employee_name}</td>
                    <td>{issue.quantity}</td>
                    <td>{new Date(issue.issued_date).toLocaleDateString()}</td>
                  </tr>
                ))}
                {recentIssues.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No recent issues</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '1.5rem' }}>
            <Link to="/issue" className="btn btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
              <ArrowRight size={18} /> Issue New Item
            </Link>
            <Link to="/stock-inward" className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', textDecoration: 'none', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Package size={18} /> Add Stock
            </Link>
            <Link to="/materials" className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', textDecoration: 'none', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <PlusCircle size={18} /> Manage Inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
