'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  FileText,
  Award,
  Key,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Application Center', href: '/application-center', icon: FileText },
  { label: 'Rank Center', href: '/rank-center', icon: Award },
  { label: 'API Keys', href: '/api-keys', icon: Key },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        'flex flex-col h-full bg-slate-900/95 border-r border-slate-800/60 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={clsx('flex items-center gap-3 p-4 border-b border-slate-800/60', collapsed && 'justify-center')}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-600 to-rose-500 flex items-center justify-center shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-white font-bold text-base">Polaris</span>
            <span className="text-pink-400 font-bold text-base"> Pilot</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                collapsed ? 'justify-center' : '',
                isActive
                  ? 'bg-gradient-to-r from-pink-600/30 to-rose-600/20 text-pink-300 border border-pink-500/30 shadow-lg shadow-pink-900/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              )}
            >
              <Icon size={18} className={isActive ? 'text-pink-400' : ''} />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Collapse */}
      <div className="p-3 border-t border-slate-800/60 space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/40">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-600 to-rose-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.username}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => logout()}
          className={clsx(
            'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-colors',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={16} />
          {!collapsed && 'Logout'}
        </button>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={clsx(
            'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 transition-colors',
            collapsed && 'justify-center'
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
