'use client';

import React from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({ label, error, helper, options, placeholder, className, id, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={inputId}
          className={clsx(
            'w-full px-3 py-2 pr-8 rounded-lg bg-slate-900/80 border text-slate-100 appearance-none',
            'focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer',
            error
              ? 'border-red-500/70 focus:ring-red-500/50'
              : 'border-slate-700/60 focus:ring-pink-500/50 focus:border-pink-500/70',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      {helper && !error && <p className="mt-1 text-xs text-slate-500">{helper}</p>}
    </div>
  );
}
