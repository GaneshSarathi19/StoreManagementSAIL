import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layers, Package, Database, HardDrive } from 'lucide-react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const getIcon = (name) => {
    if (name.toLowerCase().includes('cartridge')) return <Database size={40} />;
    if (name.toLowerCase().includes('toner')) return <HardDrive size={40} />;
    return <Package size={40} />;
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Item Categories</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage and explore inventory by category.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {categories.map((cat) => (
          <div key={cat.id} className="glass-card fade-in" style={{ padding: '2.5rem', textAlign: 'center', transition: 'all 0.3s ease', cursor: 'pointer' }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.05)', 
              width: '80px', 
              height: '80px', 
              borderRadius: '20px', 
              margin: '0 auto 1.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--secondary)'
            }}>
              {getIcon(cat.name)}
            </div>
            <h2 style={{ marginBottom: '1rem' }}>{cat.name}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              View and manage all items registered under {cat.name} category.
            </p>
            <Link to={`/materials?category_id=${cat.id}`} className="btn btn-primary" style={{ textDecoration: 'none', width: '100%', justifyContent: 'center' }}>
              View Materials
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
