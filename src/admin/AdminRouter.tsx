import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Login } from './Login';
import { Dashboard } from './Dashboard';

export function AdminRouter() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
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
