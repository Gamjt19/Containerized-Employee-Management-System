import React from 'react';
import { Users, Building2, DollarSign, TrendingUp } from 'lucide-react';

export default function StatsCards({ employees = [] }) {
  const totalEmployees = employees.length;

  const departments = new Set(
    employees.map((e) => e.department).filter(Boolean)
  );

  const totalSalary = employees.reduce((acc, curr) => acc + (Number(curr.salary) || 0), 0);
  const avgSalary = totalEmployees > 0 ? Math.round(totalSalary / totalEmployees) : 0;
  const maxSalary = employees.reduce((max, curr) => Math.max(max, Number(curr.salary) || 0), 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">
          <Users size={24} />
        </div>
        <div className="stat-info">
          <h3>Total Headcount</h3>
          <div className="stat-value">{totalEmployees}</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
          <Building2 size={24} />
        </div>
        <div className="stat-info">
          <h3>Departments</h3>
          <div className="stat-value">{departments.size}</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
          <DollarSign size={24} />
        </div>
        <div className="stat-info">
          <h3>Average Salary</h3>
          <div className="stat-value">{formatCurrency(avgSalary)}</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
          <TrendingUp size={24} />
        </div>
        <div className="stat-info">
          <h3>Highest Salary</h3>
          <div className="stat-value">{formatCurrency(maxSalary)}</div>
        </div>
      </div>
    </div>
  );
}
