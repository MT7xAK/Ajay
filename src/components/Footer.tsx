import React from 'react';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">
              Smart Local Problem Reporter System
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
