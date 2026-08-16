import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  employee,
  isDeleting = false,
}) {
  if (!isOpen || !employee) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h2 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} />
            <span>Confirm Deletion</span>
          </h2>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-main)', marginBottom: '12px' }}>
            Are you sure you want to delete the employee record for:
          </p>
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontWeight: 600 }}>{employee.name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {employee.position} &bull; {employee.department}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '4px' }}>
              {employee.email}
            </div>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--danger)', marginTop: '12px' }}>
            This action is permanent and cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(employee.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="spin-icon" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Employee</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
