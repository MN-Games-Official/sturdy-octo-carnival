'use client';

import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, glass = false, hover = false, padding = 'md' }: CardProps) {
  const paddings = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-6' };

  return (
    <div
      className={clsx(
        'rounded-xl border',
        glass
          ? 'bg-slate-900/40 backdrop-blur-sm border-slate-700/40'
          : 'bg-slate-900/80 border-slate-800/60',
        hover && 'transition-all duration-200 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-900/10',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('pb-4 border-b border-slate-800/60 mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={clsx('text-lg font-semibold text-white', className)}>
      {children}
    </h3>
  );
}
