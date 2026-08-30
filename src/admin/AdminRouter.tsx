import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Login } from './Login';
import { Dashboard } from './Dashboard';

const AUTHORIZED_ADMIN_EMAILS = ['abspavel126@gmail.com', 'hello@paveljoy.com'];

export function AdminRouter() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Add a 5 second timeout to prevent infinite loading if Supabase is unreachable
    const fetchSession = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('TIMEOUT')), 5000);
        });
        
        const sessionPromise = supabase.auth.getSession();
        
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (isMounted) {
          const userEmail = session?.user?.email?.toLowerCase();
          if (userEmail && AUTHORIZED_ADMIN_EMAILS.map(e => e.toLowerCase()).includes(userEmail)) {
            setSession(session);
          } else if (session) {
            // Force sign-out if a non-authorized user is logged in
            await supabase.auth.signOut();
            setSession(null);
          } else {
            setSession(null);
          }
          setLoading(false);
        }
      } catch (err) {
        console.warn("Session fetch failed or timed out:", err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        const email = newSession?.user?.email?.toLowerCase();
        if (email && AUTHORIZED_ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email)) {
          setSession(newSession);
        } else {
          setSession(null);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/70 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
          <span className="text-xs uppercase tracking-widest text-white/50">Verifying Authorization...</span>
        </div>
      </div>
    );
  }

  const userEmail = session?.user?.email?.toLowerCase();
  const isAuthorized = !!userEmail && AUTHORIZED_ADMIN_EMAILS.map(e => e.toLowerCase()).includes(userEmail);

  return (
    <Routes>
      <Route path="/" element={isAuthorized ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/admin/login" replace />} />
      <Route path="/login" element={!isAuthorized ? <Login /> : <Navigate to="/admin/dashboard" replace />} />
      <Route path="/dashboard/*" element={isAuthorized ? <Dashboard /> : <Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

