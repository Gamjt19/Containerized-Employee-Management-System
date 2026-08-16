import React from 'react';
import { Edit2, Trash2, Users, SearchX, Plus } from 'lucide-react';

export default function EmployeeTable({
  employees = [],
  isLoading,
  onEdit,
  onDelete,
  onAddNew,
  searchTerm,
}) {
  const getDepartmentBadgeClass = (dept) => {
    const d = (dept || '').toLowerCase();
    if (d.includes('eng') || d.includes('tech') || d.includes('dev')) return 'badge-engineering';
    if (d.includes('sec')) return 'badge-security';
    if (d.includes('prod')) return 'badge-product';
    if (d.includes('des') || d.includes('ux') || d.includes('ui')) return 'badge-design';
    if (d.includes('mark') || d.includes('growth')) return 'badge-marketing';
    if (d.includes('hr') || d.includes('human')) return 'badge-hr';
    if (d.includes('fin') || d.includes('acc')) return 'badge-finance';
    return 'badge-default';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  if (isLoading) {
    return (
      <div className="table-card">
        <div className="state-container">
          <div className="spinner"></div>
          <div className="state-title">Loading employees...</div>
          <div className="state-description">Fetching data from the backend REST API</div>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="table-card">
        <div className="state-container">
          <div className="state-icon">
            {searchTerm ? <SearchX size={32} /> : <Users size={32} />}
          </div>
          <div className="state-title">
            {searchTerm ? 'No matching employees found' : 'No employees in directory'}
          </div>
          <p className="state-description">
            {searchTerm
              ? `No results matched "${searchTerm}". Try checking your spelling or clearing filters.`
              : 'Your employee management database is currently empty. Get started by adding your first employee.'}
          </p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={onAddNew}>
              <Plus size={16} />
              <span>Add First Employee</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Salary</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>
                  <div className="emp-name-cell">
                    <div className="emp-avatar">{getInitials(emp.name)}</div>
                    <div className="emp-name-info">
                      <div className="emp-name">{emp.name}</div>
                      <div className="emp-id">ID: #{emp.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{emp.email}</td>
                <td>
                  <span className={`badge ${getDepartmentBadgeClass(emp.department)}`}>
                    {emp.department}
                  </span>
                </td>
                <td style={{ fontWeight: 500 }}>{emp.position}</td>
                <td className="salary-text">{formatCurrency(emp.salary)}</td>
                <td>
                  <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                    <button
                      className="icon-btn"
                      onClick={() => onEdit(emp)}
                      title="Edit employee"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => onDelete(emp)}
                      title="Delete employee"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
