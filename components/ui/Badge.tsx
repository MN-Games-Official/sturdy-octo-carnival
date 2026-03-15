'use client';

import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'pink';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700',
    success: 'bg-green-900/40 text-green-400 border border-green-800/50',
    warning: 'bg-yellow-900/40 text-yellow-400 border border-yellow-800/50',
    danger: 'bg-red-900/40 text-red-400 border border-red-800/50',
    info: 'bg-blue-900/40 text-blue-400 border border-blue-800/50',
    pink: 'bg-pink-900/40 text-pink-400 border border-pink-800/50',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span className={clsx('inline-flex items-center rounded-full font-medium', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
