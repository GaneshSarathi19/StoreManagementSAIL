import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Send, User, AlertCircle, CheckCircle, Package, Layers } from 'lucide-react';

const IssuePage = () => {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [departments, setDepartments] = useState([]);
  
  const [formData, setFormData] = useState({
    material_id: '',
    material_code: '',
    quantity: 1,
    emp_id: '',
    employee_name: '',
    department: '',
    remarks: ''
  });

  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, matRes, issuesRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/materials'),
          axios.get('/api/issues')
        ]);
        setCategories(catRes.data);
        setAllMaterials(matRes.data);
        
        // Extract unique departments from issued items
        const uniqueDepts = [...new Set(issuesRes.data.map(i => i.department).filter(d => d))];
        setDepartments(uniqueDepts);
        
        // Handle pre-selected category from URL
        const queryParams = new URLSearchParams(location.search);
        const catName = queryParams.get('category');
        if (catName) {
          setSelectedCategory(catName);
          const filtered = matRes.data.filter(m => m.category_name === catName);
          setFilteredMaterials(filtered);
        } else {
          setFilteredMaterials(matRes.data);
        }
      } catch (err) {
        setStatus({ type: 'error', message: 'Failed to load initial data' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.search]);

  // Handle Category Change
  const handleCategoryChange = (e) => {
    const catName = e.target.value;
    setSelectedCategory(catName);
    
    // Filter materials
    if (catName) {
      const filtered = allMaterials.filter(m => m.category_name === catName);
      setFilteredMaterials(filtered);
    } else {
      setFilteredMaterials(allMaterials);
    }
    
    // Reset material selection
    setFormData({ ...formData, material_id: '', material_code: '' });
    setSelectedMaterial(null);
  };

  // Sync Material Name/Code
  const handleMaterialChange = (materialId) => {
    const found = allMaterials.find(m => m.id === parseInt(materialId));
    if (found) {
      setSelectedMaterial(found);
      setFormData({
        ...formData,
        material_id: found.id,
        material_code: found.material_code
      });
    } else {
      setSelectedMaterial(null);
      setFormData({
        ...formData,
        material_id: '',
        material_code: ''
      });
    }
  };

  // Auto-fetch employee details
  const handleEmpIdBlur = async () => {
    if (!formData.emp_id) return;
    try {
      const res = await axios.get(`/api/employees/${formData.emp_id}`);
      if (res.data) {
        setFormData({
          ...formData,
          employee_name: res.data.name,
          department: res.data.department
        });
        setStatus({ type: 'info', message: 'Previous details found for this Employee ID.' });
      }
    } catch (err) {
      // Not found is fine
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMaterial) {
      setStatus({ type: 'error', message: "Please select a valid material" });
      return;
    }
    if (formData.quantity > selectedMaterial.remaining_qty) {
      setStatus({ type: 'error', message: "Insufficient stock available!" });
      return;
    }

    try {
      await axios.post('/api/issues', formData);
      setStatus({ type: 'success', message: 'Item issued successfully! Stock updated.' });
      
      // Reset form
      setFormData({
        material_id: '',
        material_code: '',
        quantity: 1,
        emp_id: '',
        employee_name: '',
        department: '',
        remarks: ''
      });
      setSelectedMaterial(null);
      
      // Refresh materials list
      const matRes = await axios.get('/api/materials');
      setAllMaterials(matRes.data);
      if (selectedCategory) {
        setFilteredMaterials(matRes.data.filter(m => m.category_name === selectedCategory));
      } else {
        setFilteredMaterials(matRes.data);
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || "Error issuing item" });
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Issue Form...</div>;

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Issue Material</h1>
        <p style={{ color: 'var(--text-muted)' }}>Issue items from sub-store to employees. Selective category filtering supported.</p>
      </div>

      {status.message && (
        <div className="glass-card fade-in" style={{ 
          padding: '1rem', 
          marginBottom: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '10px',
          borderLeft: `4px solid ${status.type === 'success' ? 'var(--success)' : status.type === 'error' ? 'var(--danger)' : 'var(--secondary)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {status.type === 'success' ? <CheckCircle color="var(--success)" /> : <AlertCircle color={status.type === 'error' ? 'var(--danger)' : 'var(--secondary)'} />}
            <span>{status.message}</span>
          </div>
          <button onClick={() => setStatus({type: '', message: ''})} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
        </div>
      )}

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={18} color="var(--secondary)" /> Material Selection
            </h3>
            {selectedMaterial && (
              <span className="badge" style={{ background: selectedMaterial.remaining_qty < 10 ? 'var(--danger)22' : 'var(--success)22', color: selectedMaterial.remaining_qty < 10 ? 'var(--danger)' : 'var(--success)' }}>
                Stock: {selectedMaterial.remaining_qty} available
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label><Layers size={14} style={{ marginRight: '5px' }} /> Category</label>
              <select 
                value={selectedCategory} 
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Material Name</label>
              <select 
                required 
                value={formData.material_id} 
                onChange={(e) => handleMaterialChange(e.target.value)}
              >
                <option value="">-- Select Material --</option>
                {filteredMaterials.map(m => (
                  <option key={m.id} value={m.id}>{m.material_name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Material Code</label>
              <input 
                disabled
                placeholder="Auto-filled"
                value={formData.material_code}
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ maxWidth: '200px', marginTop: '1rem' }}>
            <label>Quantity to Issue</label>
            <input 
              type="number" 
              min="1" 
              required
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
            />
          </div>

          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', margin: '2rem 0 1.5rem', paddingBottom: '0.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--secondary)" /> Recipient Details
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Employee ID</label>
              <input 
                required
                placeholder="EMP-ID (e.g. 101)"
                value={formData.emp_id}
                onChange={(e) => setFormData({...formData, emp_id: e.target.value})}
                onBlur={handleEmpIdBlur}
              />
            </div>
            <div className="form-group">
              <label>Employee Name</label>
              <input 
                required
                placeholder="Full Name"
                value={formData.employee_name}
                onChange={(e) => setFormData({...formData, employee_name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select 
                required
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              >
                <option value="">-- Select Department --</option>
                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                <option value="" disabled style={{borderTop: '1px solid #ccc'}}>Add New</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Remarks</label>
            <textarea 
              rows="2" 
              placeholder="Any additional notes..."
              value={formData.remarks}
              onChange={(e) => setFormData({...formData, remarks: e.target.value})}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '1.5rem' }}>
            <Send size={18} /> Process Issuance
          </button>
        </form>
      </div>
    </div>
  );
};

export default IssuePage;
