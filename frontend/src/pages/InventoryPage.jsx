import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, History, Package, Truck, AlertCircle } from 'lucide-react';

const InventoryPage = () => {
  const [materials, setMaterials] = useState([]);
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    material_id: '',
    supplier_name: '',
    quantity_added: '',
    remarks: ''
  });
  const [status, setStatus] = useState('');

  const fetchData = async () => {
    try {
      const [mRes, lRes] = await Promise.all([
        axios.get('/api/materials'),
        axios.get('/api/stock/logs')
      ]);
      setMaterials(mRes.data);
      setLogs(lRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/stock/inward', formData);
      setStatus('Stock successfully added!');
      setFormData({ material_id: '', supplier_name: '', quantity_added: '', remarks: '' });
      fetchData();
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      alert("Error adding stock");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Stock Inward / Inventory</h1>
        <p style={{ color: 'var(--text-muted)' }}>Add new stock from main store and track inward movements.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Form Column */}
        <div>
          <div className="glass-card" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={20} color="var(--secondary)" /> Receive New Stock
            </h3>

            {status && (
              <div style={{ padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {status}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Material</label>
                <select 
                  required 
                  value={formData.material_id}
                  onChange={(e) => setFormData({...formData, material_id: e.target.value})}
                >
                  <option value="">-- Select --</option>
                  {materials.map(m => (
                    <option key={m.id} value={m.id}>{m.material_name} ({m.material_code})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantity Added</label>
                <input 
                  type="number" 
                  required 
                  min="1"
                  value={formData.quantity_added}
                  onChange={(e) => setFormData({...formData, quantity_added: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Supplier / Source</label>
                <input 
                  placeholder="e.g. Main Store, Vendor Name"
                  value={formData.supplier_name}
                  onChange={(e) => setFormData({...formData, supplier_name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Remarks</label>
                <textarea 
                  rows="3"
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <PlusCircle size={18} /> Update Inventory
              </button>
            </form>
          </div>
        </div>

        {/* Logs Column */}
        <div>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={20} color="var(--secondary)" /> Recent Inward Logs
            </h3>
            
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Supplier</th>
                    <th>Qty</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{log.material_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.material_code}</div>
                      </td>
                      <td>{log.supplier_name || 'N/A'}</td>
                      <td style={{ color: 'var(--success)', fontWeight: '600' }}>+{log.quantity_added}</td>
                      <td>{new Date(log.date_added).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No inward records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
