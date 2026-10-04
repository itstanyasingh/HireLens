import React, { useState } from 'react';
import { X, Mail, Lock, ShieldCheck, ArrowRight, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email);
      onClose();
    }, 600);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('user@gmail.com');
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#071310]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto no-print animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#E2E8E5] shadow-2xl w-full max-w-md overflow-hidden my-auto p-7 sm:p-8 space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#788582] hover:text-[#273330] p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-[#DDF5EC] text-[#16B889] flex items-center justify-center mx-auto shadow-2xs">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-bold text-[#273330] tracking-tight">
            {mode === 'signin' ? 'Welcome back to HireLens' : 'Create your HireLens account'}
          </h2>

          <p className="text-xs text-[#697572]">
            {mode === 'signin'
              ? 'Sign in to access your saved resume scores and tailoring history.'
              : 'Save your resume scores, optimize bullet points, and match dream jobs.'}
          </p>
        </div>

        {/* OAuth Button */}
        <button
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full h-[44px] rounded-xl border border-[#D8E0DC] hover:border-slate-400 bg-white text-[#273330] font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-2xs hover:shadow-xs cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#EAEFEA]"></div>
          <span className="text-[11px] text-[#8E9E9A] uppercase tracking-wider font-semibold">Or with email</span>
          <div className="flex-1 h-px bg-[#EAEFEA]"></div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#273330] block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8E9E9A] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-[42px] pl-10 pr-4 rounded-xl border border-[#D8E0DC] text-xs text-[#273330] focus:border-[#16B889] focus:ring-2 focus:ring-[#16B889]/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#273330]">Password</label>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to your email.')}
                className="text-[11px] text-[#16B889] hover:underline cursor-pointer"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8E9E9A] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-[42px] pl-10 pr-4 rounded-xl border border-[#D8E0DC] text-xs text-[#273330] focus:border-[#16B889] focus:ring-2 focus:ring-[#16B889]/20 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[44px] rounded-xl bg-[#16B889] hover:bg-[#129A72] text-white font-bold text-xs transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : mode === 'signin' ? 'Sign In to HireLens' : 'Create Free Account'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="text-center pt-2 border-t border-[#EEF2F0]">
          <p className="text-xs text-[#697572]">
            {mode === 'signin' ? "Don't have an account yet?" : 'Already have an account?'}
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
              }}
              className="ml-1 text-[#16B889] font-bold hover:underline cursor-pointer"
            >
              {mode === 'signin' ? 'Sign up for free' : 'Sign in'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
