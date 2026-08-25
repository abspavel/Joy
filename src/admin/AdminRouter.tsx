import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Login } from './Login';
import { Dashboard } from './Dashboard';

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
          setSession(session);
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSession(session);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-800">Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={session ? <Navigate to="/admin/dashboard" /> : <Navigate to="/admin/login" />} />
      <Route path="/login" element={!session ? <Login /> : <Navigate to="/admin/dashboard" />} />
      <Route path="/dashboard/*" element={session ? <Dashboard /> : <Navigate to="/admin/login" />} />
    </Routes>
  );
}
