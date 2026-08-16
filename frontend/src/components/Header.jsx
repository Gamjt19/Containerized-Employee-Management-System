import React from 'react';
import { Users, UserPlus, RefreshCw } from 'lucide-react';

export default function Header({ backendHealthy, onRefresh, onAddEmployee, isRefreshing }) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="logo-badge">
          <Users size={24} />
        </div>
        <div className="header-title">
          <h1>Employee Management System</h1>
          <p>Manage employee records, departments, and positions</p>
        </div>
      </div>

      <div className="header-actions">
        <div
          className={`status-pill ${backendHealthy ? 'healthy' : 'unhealthy'}`}
          title={backendHealthy ? 'Backend API connected' : 'Backend API unavailable'}
        >
          <span className="status-dot"></span>
          <span>{backendHealthy ? 'API Online' : 'API Offline'}</span>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Data"
        >
          <RefreshCw size={15} className={isRefreshing ? 'spin-icon' : ''} />
          <span>Refresh</span>
        </button>

        <button className="btn btn-primary" onClick={onAddEmployee}>
          <UserPlus size={18} />
          <span>Add Employee</span>
        </button>
      </div>
    </header>
  );
}
