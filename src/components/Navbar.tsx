import React from 'react';
import { User } from '../types';
import { Shield, FileText, PlusCircle, LayoutDashboard, Code, LogIn, LogOut, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'report' | 'my-complaints' | 'admin' | 'deliverables';
  setCurrentTab: (tab: 'home' | 'report' | 'my-complaints' | 'admin' | 'deliverables') => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSwitchToAdmin: () => void;
  onSwitchToUser: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenAuth,
  onLogout,
  onSwitchToAdmin,
  onSwitchToUser
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-2">
                CivicReporter
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">Smart Local Problem Reporter & Auto-Suggestion System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'home'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setCurrentTab('report')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'report'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              Report Issue
            </button>

            <button
              onClick={() => setCurrentTab('my-complaints')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'my-complaints'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              My Complaints
            </button>

            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'admin'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-amber-600" />
              Admin Portal
            </button>
          </nav>

          {/* Quick User / Admin Switcher & Auth Controls */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                  <span className={`w-2 h-2 rounded-full ${currentUser.role === 'ADMIN' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                  <span className="font-semibold text-slate-800">{currentUser.name}</span>
                  <span className="text-slate-500 font-medium">({currentUser.role})</span>
                </div>

                {currentUser.role === 'ADMIN' ? (
                  <button
                    onClick={onSwitchToUser}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-md transition-colors font-medium"
                    title="Switch view to regular citizen mode"
                  >
                    Switch to Citizen
                  </button>
                ) : (
                  <button
                    onClick={onSwitchToAdmin}
                    className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1 font-semibold"
                    title="Quick demo switch to Admin"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                    Demo Admin
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-sm shadow-blue-600/20"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-200 overflow-x-auto gap-2 text-xs">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-2.5 py-1.5 rounded-md whitespace-nowrap font-medium ${currentTab === 'home' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentTab('report')}
            className={`px-2.5 py-1.5 rounded-md whitespace-nowrap font-medium ${currentTab === 'report' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
          >
            Report
          </button>
          <button
            onClick={() => setCurrentTab('my-complaints')}
            className={`px-2.5 py-1.5 rounded-md whitespace-nowrap font-medium ${currentTab === 'my-complaints' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
          >
            My Complaints
          </button>

          <button
            onClick={() => setCurrentTab('admin')}
            className={`px-2.5 py-1.5 rounded-md whitespace-nowrap font-medium ${currentTab === 'admin' ? 'bg-amber-600 text-white' : 'text-slate-600'}`}
          >
            Admin
          </button>
          <button
            onClick={() => setCurrentTab('deliverables')}
            className={`px-2.5 py-1.5 rounded-md whitespace-nowrap font-medium ${currentTab === 'deliverables' ? 'bg-purple-600 text-white' : 'text-indigo-600'}`}
          >
            BCA Project Files
          </button>
        </div>
      </div>
    </header>
  );
};
