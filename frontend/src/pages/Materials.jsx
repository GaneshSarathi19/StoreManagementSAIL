import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Filter, X } from 'lucide-react';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  
  const query = new URLSearchParams(useLocation().search);
  const initialCategory = query.get('category_id') || '';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const [formData, setFormData] = useState({
    material_name: '',
    material_code: '',
    category_id: '',
    cost: 0,
    remaining_qty: 0,
    supplier_name: '',
    other_details: ''
  });

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`/api/materials?category_id=${selectedCategory}`);
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMaterials();
    axios.get('/api/categories').then(res => setCategories(res.data));
  }, [selectedCategory]);

  const handleOpenModal = (m = null) => {
    if (m) {
      setEditingMaterial(m);
      setFormData(m);
    } else {
      setEditingMaterial(null);
      setFormData({
        material_name: '',
        material_code: '',
        category_id: selectedCategory,
        cost: 0,
        remaining_qty: 0,
        supplier_name: '',
        other_details: ''
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingMaterial) {
        await axios.put(`/api/materials/${editingMaterial.id}`, formData);
      } else {
        await axios.post('/api/materials', formData);
      }
      setShowModal(false);
      fetchMaterials();
    } catch (err) {
      alert("Error saving material: " + err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      await axios.delete(`/api/materials/${id}`);
      fetchMaterials();
    }
  };

  const filteredMaterials = materials.filter(m => 
    m.material_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.material_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Inventory Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your sub-store items and stock levels.</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} /> Add New Material
        </button>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by name or code..." 
              style={{ paddingLeft: '40px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={18} color="var(--text-muted)" />
            <select 
              style={{ width: '200px' }} 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="glass-card table-container">
        <table>
          <thead>
            <tr>
              <th>Material Information</th>
              <th>Category</th>
              <th>Static Cost</th>
              <th>Current Qty</th>
              <th>Supplier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.map(m => (
              <tr key={m.id}>
                <td>
                  <div style={{ fontWeight: '600' }}>{m.material_name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.material_code}</div>
                </td>
                <td><span style={{ padding: '4px 8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--secondary)', borderRadius: '4px', fontSize: '0.8rem' }}>{m.category_name}</span></td>
                <td>₹{m.cost}</td>
                <td>
                  <span style={{ 
                    fontWeight: '700', 
                    color: m.remaining_qty < 10 ? 'var(--danger)' : 'inherit' 
                  }}>
                    {m.remaining_qty}
                  </span>
                </td>
                <td>{m.supplier_name || 'N/A'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleOpenModal(m)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit size={18} /></button>
                    <button onClick={() => handleDelete(m.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <div className="glass-card fade-in" style={{ width: '600px', padding: '2rem', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2>{editingMaterial ? 'Edit Material' : 'Add New Material'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-main)' }}><X /></button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label>Material Name</label>
                  <input required value={formData.material_name} onChange={e => setFormData({...formData, material_name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Material Code (Unique)</label>
                  <input required value={formData.material_code} onChange={e => setFormData({...formData, material_code: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Cost</label>
                  <input type="number" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Remaining Quantity</label>
                  <input type="number" value={formData.remaining_qty} onChange={e => setFormData({...formData, remaining_qty: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Supplier Name</label>
                  <input value={formData.supplier_name} onChange={e => setFormData({...formData, supplier_name: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Other Details</label>
                <textarea rows="3" value={formData.other_details} onChange={e => setFormData({...formData, other_details: e.target.value})}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn" style={{ background: '#f0f0f0', color: 'var(--text-main)' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Material</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materials;
