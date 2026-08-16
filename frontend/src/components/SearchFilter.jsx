import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  departments = [],
  onClear,
}) {
  return (
    <div className="filter-bar">
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, department, or role..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="filter-controls">
        <select
          className="select-filter"
          value={departmentFilter}
          onChange={(e) => onDepartmentChange(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {(searchTerm || departmentFilter) && (
          <button className="btn btn-ghost btn-sm" onClick={onClear}>
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
