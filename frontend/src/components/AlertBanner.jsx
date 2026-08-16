import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function AlertBanner({ alert, onClose }) {
  if (!alert || !alert.message) return null;

  const isSuccess = alert.type === 'success';

  return (
    <div className={`alert ${isSuccess ? 'alert-success' : 'alert-error'}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        <span>{alert.message}</span>
      </div>
      <button className="alert-close" onClick={onClose} title="Dismiss notification">
        <X size={16} />
      </button>
    </div>
  );
}
