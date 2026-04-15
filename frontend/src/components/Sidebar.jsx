import { useNavigate, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Send, 
  PlusCircle, 
  FileText, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const links = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/categories', icon: <Layers size={20} />, label: 'Categories' },
    { to: '/materials', icon: <Package size={20} />, label: 'Materials' },
    { to: '/issue', icon: <Send size={20} />, label: 'Issue Items' },
    { to: '/stock-inward', icon: <PlusCircle size={20} />, label: 'Stock Inward' },
    { to: '/reports', icon: <FileText size={20} />, label: 'Reports' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
    window.location.reload(); // Force reload to trigger App.jsx re-render
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{ background: 'var(--secondary)', padding: '8px', borderRadius: '8px', display: 'flex' }}>
          <Package color="#fff" size={24} />
        </div>
        <span>SAIL Store</span>
      </div>

      <ul className="nav-links">
        {links.map((link) => (
          <li key={link.to} className="nav-item">
            <NavLink 
              to={link.to} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {link.icon}
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
        <button 
          className="nav-link" 
          style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
