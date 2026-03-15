'use client';

import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'bg-green-900/90 border-green-700/60 text-green-100',
  error: 'bg-red-900/90 border-red-700/60 text-red-100',
  warning: 'bg-yellow-900/90 border-yellow-700/60 text-yellow-100',
  info: 'bg-slate-800/90 border-slate-700/60 text-slate-100',
};

interface ToastItemProps {
  toast: { id: string; message: string; type: 'success' | 'error' | 'warning' | 'info' };
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const Icon = icons[toast.type];

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-3 pr-2 rounded-lg border backdrop-blur-sm shadow-xl',
        'animate-in slide-in-from-right-5 fade-in duration-300',
        styles[toast.type]
      )}
    >
      <Icon size={16} className="shrink-0 mt-0.5" />
      <p className="text-sm flex-1 leading-relaxed">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity p-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
}
