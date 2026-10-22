import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import uxhubLogo from '../assets/logo.svg';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Explicitly reset credentials and clear stored values
    setUsername('');
    setPassword('');
    localStorage.removeItem('brandswamy_login_username');
    localStorage.removeItem('brandswamy_login_password');

    // Keep fields read-only for initial render cycle to block browser password manager auto-fill
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login({ username, password });
      } else {
        await authService.register({ username, password });
      }
      onLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-orange-50/25">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img src={uxhubLogo} alt="UX HUB Logo" className="h-14 sm:h-16 w-auto object-contain drop-shadow-xs" />
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Accounts Manager
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {isLogin ? 'Sign in to access your dashboard' : 'Create a new account'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
            {/* Decoy hidden inputs to deflect browser autofill managers */}
            <div style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1, overflow: 'hidden' }} aria-hidden="true">
              <input type="text" name="fake_username" tabIndex={-1} autoComplete="off" />
              <input type="password" name="fake_password" tabIndex={-1} autoComplete="off" />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Username</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="login_username"
                  name="login_username"
                  required
                  autoComplete="off"
                  readOnly={!isReady}
                  onFocus={() => setIsReady(true)}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="focus:ring-2 focus:ring-[#f56523]/30 focus:border-[#f56523] block w-full pl-10 sm:text-sm border-slate-300 rounded-xl h-11 bg-slate-50 border transition-all"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="login_password"
                  name="login_password"
                  required
                  autoComplete="new-password"
                  readOnly={!isReady}
                  onFocus={() => setIsReady(true)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-2 focus:ring-[#f56523]/30 focus:border-[#f56523] block w-full pl-10 pr-10 sm:text-sm border-slate-300 rounded-xl h-11 bg-slate-50 border transition-all"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#f56523] transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-slate-900 hover:bg-[#f56523] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f56523] transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/25 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create account')}
                {!loading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>

          {/* Or / Register toggle — commented out (registration is invite-only)
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-300 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {isLogin ? 'Need an account? Register' : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
          */}
        </div>
      </div>
    </div>
  );
}
