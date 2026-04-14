import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Search, AlertCircle, CheckCircle } from 'lucide-react';

const IssuePage = () => {
  const [materials, setMaterials] = useState([]);
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

  useEffect(() => {
    axios.get('/api/materials').then(res => setMaterials(res.data));
  }, []);

  // Sync Material Name/Code
  const handleMaterialChange = (e, type) => {
    const val = e.target.value;
    let found;
    if (type === 'id') {
      found = materials.find(m => m.id === parseInt(val));
    } else {
      found = materials.find(m => m.material_code === val);
    }

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
        material_id: type === 'id' ? val : formData.material_id,
        material_code: type === 'code' ? val : formData.material_code
      });
    }
  };

  // Auto-fetch employee details
  const handleEmpIdBlur = async () => {
    if (!formData.emp_id) return;
    try {
      const res = await axios.get(`/api/employees/${formData.emp_id}`);
      setFormData({
        ...formData,
        employee_name: res.data.name,
        department: res.data.department
      });
      setStatus({ type: 'info', message: 'Employee details fetched automatically.' });
    } catch (err) {
      // Not an error, just means new employee
      setStatus({ type: '', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMaterial) return alert("Please select a valid material");
    if (formData.quantity > selectedMaterial.remaining_qty) {
      return alert("Insufficient stock!");
    }

    try {
      await axios.post('/api/issues', formData);
      setStatus({ type: 'success', message: 'Item issued successfully and inventory updated!' });
      // Reset form but keep material to issue more if needed? Usually reset.
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
      axios.get('/api/materials').then(res => setMaterials(res.data));
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || "Error issuing item" });
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Issue Material</h1>
        <p style={{ color: 'var(--text-muted)' }}>Issue items from sub-store to employees.</p>
      </div>

      {status.message && (
        <div className="glass-card fade-in" style={{ 
          padding: '1rem', 
          marginBottom: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          borderLeft: `4px solid ${status.type === 'success' ? 'var(--success)' : status.type === 'error' ? 'var(--danger)' : 'var(--secondary)'}`
        }}>
          {status.type === 'success' ? <CheckCircle color="var(--success)" /> : <AlertCircle color="var(--secondary)" />}
          <span>{status.message}</span>
        </div>
      )}

      <div className="glass-card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={18} color="var(--secondary)" /> Material Details
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Select Material Name</label>
              <select 
                required 
                value={formData.material_id} 
                onChange={(e) => handleMaterialChange(e, 'id')}
              >
                <option value="">-- Select Material --</option>
                {materials.map(m => (
                  <option key={m.id} value={m.id}>{m.material_name} ({m.remaining_qty} available)</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Material Code</label>
              <input 
                required
                placeholder="Enter or select code"
                value={formData.material_code}
                onChange={(e) => handleMaterialChange(e, 'code')}
              />
            </div>

            <div className="form-group">
              <label>Quantity to Issue</label>
              <input 
                type="number" 
                min="1" 
                required
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
              />
              {selectedMaterial && (
                <p style={{ fontSize: '0.8rem', color: formData.quantity > selectedMaterial.remaining_qty ? 'var(--danger)' : 'var(--success)', marginTop: '5px' }}>
                  Available: {selectedMaterial.remaining_qty} units
                </p>
              )}
            </div>
          </div>

          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', margin: '1.5rem 0', paddingBottom: '0.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--secondary)" /> Recipient Details
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Employee ID</label>
              <input 
                required
                placeholder="EMP-001"
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
              <input 
                required
                placeholder="Dept Name"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <textarea 
              rows="3" 
              placeholder="Any additional notes..."
              value={formData.remarks}
              onChange={(e) => setFormData({...formData, remarks: e.target.value})}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
            <Send size={18} /> Process Issuance
          </button>
        </form>
      </div>
    </div>
  );
};

export default IssuePage;
