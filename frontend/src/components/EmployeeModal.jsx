import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.\w+$/;

export default function EmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  employee = null,
  isSubmitting = false,
}) {
  const isEdit = Boolean(employee && employee.id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    salary: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        department: employee.department || '',
        position: employee.position || '',
        salary: employee.salary !== undefined ? String(employee.salary) : '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        department: '',
        position: '',
        salary: '',
      });
    }
    setErrors({});
  }, [employee, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Employee name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required.';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position / Job title is required.';
    }

    if (formData.salary === '' || formData.salary === null || isNaN(Number(formData.salary))) {
      newErrors.salary = 'Please enter a valid numeric salary.';
    } else if (Number(formData.salary) < 0) {
      newErrors.salary = 'Salary must be a non-negative number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department.trim(),
      position: formData.position.trim(),
      salary: parseFloat(formData.salary),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? `Edit Employee #${employee.id}` : 'Add New Employee'}</h2>
          <button className="icon-btn" onClick={onClose} title="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={isSubmitting}
                autoFocus
              />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="e.g. jane.doe@company.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={isSubmitting}
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Department <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.department ? 'input-error' : ''}`}
                placeholder="e.g. Engineering, Marketing, Product"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                disabled={isSubmitting}
              />
              {errors.department && <div className="error-text">{errors.department}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Position / Job Title <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.position ? 'input-error' : ''}`}
                placeholder="e.g. Senior Backend Engineer"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                disabled={isSubmitting}
              />
              {errors.position && <div className="error-text">{errors.position}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Annual Salary ($ USD) <span className="required">*</span>
              </label>
              <input
                type="number"
                step="100"
                min="0"
                className={`form-input ${errors.salary ? 'input-error' : ''}`}
                placeholder="e.g. 85000"
                value={formData.salary}
                onChange={(e) => handleChange('salary', e.target.value)}
                disabled={isSubmitting}
              />
              {errors.salary && <div className="error-text">{errors.salary}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spin-icon" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{isEdit ? 'Update Employee' : 'Save Employee'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
