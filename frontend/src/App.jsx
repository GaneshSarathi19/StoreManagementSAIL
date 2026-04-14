import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Materials from './pages/Materials';
import IssuePage from './pages/IssuePage';
import InventoryPage from './pages/InventoryPage';
import ReportsPage from './pages/ReportsPage';
import Login from './pages/Login';

function App() {
  // Simple auth check - in a real app, this would be managed via context
  const isAuthenticated = true; // For demo purposes

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/issue" element={<IssuePage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
