'use client';

import React from 'react';
import { clsx } from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export function Textarea({ label, error, helper, className, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={clsx(
          'w-full px-3 py-2 rounded-lg bg-slate-900/80 border text-slate-100 placeholder-slate-500 resize-y min-h-[80px]',
          'focus:outline-none focus:ring-2 transition-all duration-200',
          error
            ? 'border-red-500/70 focus:ring-red-500/50 focus:border-red-500'
            : 'border-slate-700/60 focus:ring-pink-500/50 focus:border-pink-500/70',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      {helper && !error && <p className="mt-1 text-xs text-slate-500">{helper}</p>}
    </div>
  );
}
