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
import logoImage from '../assets/logo.svg';

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
        <img 
          src={logoImage}
          alt="SAIL Store Logo" 
          className="logo-image" 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'block';
          }}
        />
        <div className="logo-fallback" style={{ background: 'var(--primary)', padding: '8px', borderRadius: '8px' }}>
          <Package color="#000000" size={24} />
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
