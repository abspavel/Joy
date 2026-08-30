import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AUTHORIZED_ADMIN_EMAILS = ['abspavel126@gmail.com', 'hello@paveljoy.com'];

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const sanitizedEmail = email.trim().toLowerCase();

    // Whitelist check: abspavel126@gmail.com and hello@paveljoy.com are authorized
    if (!AUTHORIZED_ADMIN_EMAILS.map(e => e.toLowerCase()).includes(sanitizedEmail)) {
      setError('Access Denied: You are not authorized to access this admin portal.');
      setLoading(false);
      return;
    }

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('TIMEOUT')), 9000);
      });

      const loginPromise = supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: password,
      });

      const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any;

      if (error) {
        setError(error.message);
      } else if (data?.user && !AUTHORIZED_ADMIN_EMAILS.map(e => e.toLowerCase()).includes(data.user.email?.toLowerCase() || '')) {
        // If somehow another user logs in, force immediate logout
        await supabase.auth.signOut();
        setError('Unauthorized account. Access restricted strictly to the primary administrator.');
      }
    } catch (err: any) {
      if (err.message === 'TIMEOUT') {
        setError('Connection timed out. Please check your internet connection.');
      } else {
        setError(err.message || 'An error occurred while logging in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary,#0a0a0a)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-purple-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 shadow-lg">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--text-primary,#fff)]">
          Admin Portal
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary,#888)] mt-1.5">
          Restricted access. Authorized administrator only.
        </p>
      </div>

      <div className="w-full sm:max-w-md">
        <div className="bg-[var(--bg-secondary,#141414)] py-8 px-6 sm:px-8 shadow-2xl rounded-3xl border border-white/10">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--text-secondary,#aaa)] mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email" 
                  required 
                  placeholder="admin@example.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="block w-full pl-10 pr-4 py-3 bg-black/40 border border-white/15 rounded-xl text-[var(--text-primary,#fff)] text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--text-secondary,#aaa)] mb-2">
                Secure Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="block w-full pl-10 pr-4 py-3 bg-black/40 border border-white/15 rounded-xl text-[var(--text-primary,#fff)] text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all" 
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs uppercase font-bold tracking-widest text-white bg-purple-600 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 transition-all shadow-lg cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>Enter Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary,#888)] hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

