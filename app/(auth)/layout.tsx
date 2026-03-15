import React from 'react';
import { Zap } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-900/50">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-xl">Polaris</span>
            <span className="text-pink-400 font-bold text-xl"> Pilot</span>
          </div>
        </div>

        {/* Content card */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/50 p-8">
          {children}
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          &copy; {new Date().getFullYear()} Polaris Pilot. All rights reserved.
        </p>
      </div>
    </div>
  );
}
