import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, 
  Download, 
  Search, 
  Calendar, 
  Filter,
  RefreshCw,
  Clock
} from 'lucide-react';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('issued'); // 'issued' or 'stock'
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    from_date: '',
    to_date: '',
    category_id: '',
    material_code: '',
    emp_id: '',
    department: '',
    quick_filter: ''
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, issuesRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/issues')
        ]);
        setCategories(catRes.data);
        
        // Extract unique departments from issued items
        const uniqueDepts = [...new Set(issuesRes.data.map(i => i.department).filter(d => d))];
        setDepartments(uniqueDepts);
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    };
    fetchInitialData();
    handleFetchReports();
  }, []);

  const handleFetchReports = () => handleFetchReportsWithParams(filters);

  const handleFetchReportsWithParams = async (currentFilters) => {
    setLoading(true);
    try {
      const params = { ...currentFilters, type: reportType };
      const res = await axios.get('/api/reports', { params });
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyQuickFilter = (val) => {
    setFilters({ ...filters, quick_filter: val, from_date: '', to_date: '' });
  };

  const handleCustomDateChange = (field, val) => {
    setFilters({ ...filters, [field]: val, quick_filter: '' });
  };

  const downloadCSV = () => {
    if (reports.length === 0) return;
    const headers = Object.keys(reports[0]).join(',');
    const rows = reports.map(r => Object.values(r).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportType}_report_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Management Reports</h1>
          <p style={{ color: 'var(--text-muted)' }}>Generate and export detailed inventory and issuance logs.</p>
        </div>
        <button className="btn btn-primary" onClick={downloadCSV} disabled={reports.length === 0}>
          <Download size={20} /> Export to CSV
        </button>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Report Type Toggle */}
          <div className="form-group" style={{ flex: '1 1 200px' }}>
            <label>Report Type</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className={`btn ${reportType === 'issued' ? 'btn-primary' : ''}`} 
                style={{ 
                  flex: 1, 
                  background: reportType === 'issued' ? '' : '#f0f0f0', 
                  color: reportType === 'issued' ? '#ffffff' : 'var(--text-main)' 
                }}
                onClick={() => setReportType('issued')}
              >
                Issued Items
              </button>
              <button 
                className={`btn ${reportType === 'stock' ? 'btn-primary' : ''}`} 
                style={{ 
                  flex: 1, 
                  background: reportType === 'stock' ? '' : '#f0f0f0', 
                  color: reportType === 'stock' ? '#ffffff' : 'var(--text-main)' 
                }}
                onClick={() => setReportType('stock')}
              >
                Stock Inward
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="form-group" style={{ flex: '1 1 100%' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} /> Quick History Filters
            </label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              {[
                { id: 'today', label: 'Today' },
                { id: '6months', label: 'Last 6 Months' },
                { id: '1year', label: 'Last 1 Year' },
                { id: '3years', label: 'Last 3 Years' },
                { id: '', label: 'Custom/All' }
              ].map(filter => (
                <button
                  key={filter.id}
                  className={`btn ${filters.quick_filter === filter.id ? 'btn-primary' : ''}`}
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '0.85rem',
                    background: filters.quick_filter === filter.id ? '' : '#f0f0f0',
                    color: filters.quick_filter === filter.id ? '#ffffff' : 'var(--text-main)',
                    border: '1px solid var(--border)'
                  }}
                  onClick={() => {
                    const newFilters = { ...filters, quick_filter: filter.id, from_date: '', to_date: '' };
                    setFilters(newFilters);
                    // Fetch immediately on quick filter click
                    setTimeout(() => handleFetchReportsWithParams(newFilters), 0);
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ flex: '1 1 400px' }}>
            <label>Custom Date Range</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="date" value={filters.from_date} onChange={(e) => handleCustomDateChange('from_date', e.target.value)} />
              <span>to</span>
              <input type="date" value={filters.to_date} onChange={(e) => handleCustomDateChange('to_date', e.target.value)} />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
          <div className="form-group">
            <label>Category</label>
            <select value={filters.category_id} onChange={(e) => setFilters({...filters, category_id: e.target.value})}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Material Code</label>
            <input placeholder="e.g. CART-01" value={filters.material_code} onChange={(e) => setFilters({...filters, material_code: e.target.value})} />
          </div>
          {reportType === 'issued' && (
            <>
              <div className="form-group">
                <label>Employee ID</label>
                <input placeholder="EMP-ID" value={filters.emp_id} onChange={(e) => setFilters({...filters, emp_id: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select value={filters.department} onChange={(e) => setFilters({...filters, department: e.target.value})}>
                  <option value="">All Departments</option>
                  {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
            </>
          )}
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '1.5rem' }}>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleFetchReports}>
              <RefreshCw size={18} className={loading ? 'spin' : ''} /> Apply Filters
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3>Report Results ({reports.length} records)</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Clock size={14} /> Generated at {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              {reportType === 'issued' ? (
                <tr>
                  <th>Date</th>
                  <th>Material (Code)</th>
                  <th>Employee</th>
                  <th>Dept</th>
                  <th>Qty</th>
                  <th>Remarks</th>
                </tr>
              ) : (
                <tr>
                  <th>Date</th>
                  <th>Material (Code)</th>
                  <th>Category</th>
                  <th>Source / Supplier</th>
                  <th>Qty Added</th>
                  <th>Remarks</th>
                </tr>
              )}
            </thead>
            <tbody>
              {reports.map((row, idx) => (
                <tr key={idx} className="fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <td>{new Date(row.issued_date || row.date_added).toLocaleDateString()}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{row.material_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.material_code}</div>
                  </td>
                  {reportType === 'issued' ? (
                    <>
                      <td>{row.employee_name} ({row.emp_id})</td>
                      <td>{row.department}</td>
                      <td>{row.quantity}</td>
                    </>
                  ) : (
                    <>
                      <td>{row.category_name}</td>
                      <td>{row.supplier_name || 'N/A'}</td>
                      <td style={{ color: 'var(--success)' }}>+{row.quantity_added}</td>
                    </>
                  )}
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '200px' }}>{row.remarks || '-'}</td>
                </tr>
              ))}
              {reports.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No records found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .spin { animation: rotate 1s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ReportsPage;
