'use client';

import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  className?: string;
}

export function Alert({ type = 'info', message, onClose, className }: AlertProps) {
  const config = {
    success: { icon: CheckCircle, cls: 'bg-green-900/30 border-green-800/50 text-green-300' },
    error: { icon: AlertCircle, cls: 'bg-red-900/30 border-red-800/50 text-red-300' },
    warning: { icon: AlertTriangle, cls: 'bg-yellow-900/30 border-yellow-800/50 text-yellow-300' },
    info: { icon: Info, cls: 'bg-blue-900/30 border-blue-800/50 text-blue-300' },
  };

  const { icon: Icon, cls } = config[type];

  return (
    <div className={clsx('flex items-start gap-3 p-4 rounded-lg border', cls, className)}>
      <Icon size={16} className="shrink-0 mt-0.5" />
      <p className="text-sm flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
