import React, { useState } from 'react';
import { User } from '../types';
import { X, Shield, Lock, Mail, Phone, User as UserIcon, LogIn, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.error || 'Authentication failed');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();

      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.error || 'Registration failed');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(`Password reset link sent to ${email}`);
  };

  const fillDemoAdmin = () => {
    setEmail('admin@civic.gov.in');
    setPassword('admin123');
  };

  const fillDemoUser = () => {
    setEmail('rahul.sharma@example.com');
    setPassword('user123');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl text-slate-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              {mode === 'login' && 'Sign In to CivicReporter'}
              {mode === 'register' && 'Create Citizen Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">Smart Local Problem Reporter System</p>
          </div>
        </div>

        {/* Demo Quick Login Presets Banner */}
        {mode === 'login' && (
          <div className="mb-5 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div className="text-slate-600 font-bold mb-2">Quick Demo Autofill Credentials:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 p-2 rounded-lg text-left transition-colors text-[11px]"
              >
                <div className="font-bold">⚡ Demo Admin</div>
                <div className="text-[10px] text-amber-700 font-medium">admin@civic.gov.in</div>
              </button>
              <button
                type="button"
                onClick={fillDemoUser}
                className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 p-2 rounded-lg text-left transition-colors text-[11px]"
              >
                <div className="font-bold">👤 Demo Citizen</div>
                <div className="text-[10px] text-blue-700 font-medium">rahul.sharma@...</div>
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl font-medium">
            {successMsg}
          </div>
        )}

        {/* FORM LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-xs text-blue-700 font-bold hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* FORM REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm"
            >
              {loading ? 'Creating Account...' : 'Register Citizen Account'}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Enter Register Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm"
            >
              Send Reset Link
            </button>
          </form>
        )}

        {/* Toggle Mode Footer */}
        <div className="mt-5 pt-4 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
          {mode === 'login' && (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-blue-700 font-bold hover:underline"
              >
                Register Here
              </button>
            </p>
          )}
          {mode !== 'login' && (
            <p>
              Already registered?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-blue-700 font-bold hover:underline"
              >
                Back to Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
