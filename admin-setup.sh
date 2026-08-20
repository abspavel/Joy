mkdir -p src/admin
mkdir -p src/admin/components

cat << 'INNER_EOF' > src/admin/AdminRouter.tsx
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
INNER_EOF

cat << 'INNER_EOF' > src/admin/Login.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
INNER_EOF

cat << 'INNER_EOF' > src/admin/Dashboard.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { HeroAdmin } from './components/HeroAdmin';
import { AboutAdmin } from './components/AboutAdmin';
import { ProjectsAdmin } from './components/ProjectsAdmin';
import { ServicesAdmin } from './components/ServicesAdmin';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('Hero');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const tabs = ['Hero', 'About', 'Circle Photos', 'Carousel', 'Projects', 'Services'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Portfolio Admin</h1>
          <button onClick={handleLogout} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Logout</button>
        </div>
      </header>
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeTab === tab ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900 hover:bg-gray-50'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </aside>
        <main className="flex-1 bg-white shadow rounded-lg p-6 overflow-x-auto text-gray-900">
          {activeTab === 'Hero' && <HeroAdmin />}
          {activeTab === 'About' && <AboutAdmin />}
          {activeTab === 'Projects' && <ProjectsAdmin />}
          {activeTab === 'Services' && <ServicesAdmin />}
          {(activeTab === 'Circle Photos' || activeTab === 'Carousel') && <div><h2 className="text-lg font-medium">Coming soon</h2><p className="mt-2 text-sm text-gray-500">Photo upload UI will be built in the next step!</p></div>}
        </main>
      </div>
    </div>
  );
}
INNER_EOF

cat << 'INNER_EOF' > src/admin/components/HeroAdmin.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function HeroAdmin() {
  const [data, setData] = useState<any>({ heading_line1: '', heading_line2: '', tagline_text: '', portrait_image_url: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase.from('hero_content').select('*').eq('id', 1).single().then(({ data }) => {
      if (data) setData(data);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('hero_content').upsert({ id: 1, ...data });
    setSaving(false);
    setMsg(error ? error.message : 'Saved successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  const uploadImage = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `hero/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('portfolio-media').upload(filePath, file);
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
      setData({ ...data, portrait_image_url: publicUrl });
    } else {
      alert("Error uploading image: " + uploadError.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Hero Section</h2>
      <div>
        <label className="block text-sm font-medium">Heading Line 1</label>
        <input className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={data.heading_line1} onChange={e => setData({...data, heading_line1: e.target.value})} />
      </div>
      <div>
        <label className="block text-sm font-medium">Heading Line 2</label>
        <input className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={data.heading_line2} onChange={e => setData({...data, heading_line2: e.target.value})} />
      </div>
      <div>
        <label className="block text-sm font-medium">Tagline Text</label>
        <textarea className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={data.tagline_text} onChange={e => setData({...data, tagline_text: e.target.value})} />
      </div>
      <div>
        <label className="block text-sm font-medium">Portrait Image</label>
        {data.portrait_image_url && <img src={data.portrait_image_url} className="h-32 my-2 bg-gray-100 object-contain rounded" />}
        <input type="file" accept="image/*" onChange={uploadImage} />
      </div>
      <button onClick={handleSave} disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-md">{saving ? 'Saving...' : 'Save Changes'}</button>
      {msg && <p className="text-sm mt-2 text-green-600">{msg}</p>}
    </div>
  );
}
INNER_EOF

cat << 'INNER_EOF' > src/admin/components/AboutAdmin.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function AboutAdmin() {
  const [data, setData] = useState<any>({ heading: '', paragraph_text: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase.from('about_content').select('*').eq('id', 1).single().then(({ data }) => {
      if (data) setData(data);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('about_content').upsert({ id: 1, ...data });
    setSaving(false);
    setMsg(error ? error.message : 'Saved successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">About Section</h2>
      <div>
        <label className="block text-sm font-medium">Heading</label>
        <input className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={data.heading} onChange={e => setData({...data, heading: e.target.value})} />
      </div>
      <div>
        <label className="block text-sm font-medium">Paragraph Text</label>
        <textarea rows={5} className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={data.paragraph_text} onChange={e => setData({...data, paragraph_text: e.target.value})} />
      </div>
      <button onClick={handleSave} disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-md">{saving ? 'Saving...' : 'Save Changes'}</button>
      {msg && <p className="text-sm mt-2 text-green-600">{msg}</p>}
    </div>
  );
}
INNER_EOF

cat << 'INNER_EOF' > src/admin/components/ProjectsAdmin.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([]);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('order_index', { ascending: true });
    if (data) setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async () => {
    const newProj = { project_number: '00', name: 'New Project', category: 'Client', order_index: projects.length };
    await supabase.from('projects').insert([newProj]);
    fetchProjects();
  };

  const updateProject = async (id: string, field: string, value: any) => {
    await supabase.from('projects').update({ [field]: value }).eq('id', id);
    fetchProjects();
  };

  const deleteProject = async (id: string) => {
    if (confirm("Are you sure?")) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Projects</h2>
        <button onClick={addProject} className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm">Add Project</button>
      </div>
      <div className="space-y-4">
        {projects.map(p => (
          <div key={p.id} className="border p-4 rounded-md space-y-3">
            <div className="flex gap-4">
              <input className="border p-1 w-16" value={p.project_number} onChange={e => updateProject(p.id, 'project_number', e.target.value)} placeholder="01" />
              <input className="border p-1 flex-1" value={p.name} onChange={e => updateProject(p.id, 'name', e.target.value)} placeholder="Project Name" />
              <select className="border p-1" value={p.category} onChange={e => updateProject(p.id, 'category', e.target.value)}>
                <option value="Client">Client</option>
                <option value="Personal">Personal</option>
              </select>
              <button onClick={() => deleteProject(p.id)} className="text-red-600 px-2">Delete</button>
            </div>
            <div className="flex gap-2 text-sm text-gray-500">
               Live URL: <input className="border p-1 flex-1" value={p.live_project_url || ''} onChange={e => updateProject(p.id, 'live_project_url', e.target.value)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
INNER_EOF

cat << 'INNER_EOF' > src/admin/components/ServicesAdmin.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function ServicesAdmin() {
  const [services, setServices] = useState<any[]>([]);

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').order('order_index', { ascending: true });
    if (data) setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const addService = async () => {
    const newSvc = { number: '00', name: 'New Service', description: 'Desc', order_index: services.length };
    await supabase.from('services').insert([newSvc]);
    fetchServices();
  };

  const updateService = async (id: string, field: string, value: any) => {
    await supabase.from('services').update({ [field]: value }).eq('id', id);
    fetchServices();
  };

  const deleteService = async (id: string) => {
    if (confirm("Are you sure?")) {
      await supabase.from('services').delete().eq('id', id);
      fetchServices();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Services</h2>
        <button onClick={addService} className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm">Add Service</button>
      </div>
      <div className="space-y-4">
        {services.map(s => (
          <div key={s.id} className="border p-4 rounded-md space-y-3">
            <div className="flex gap-4">
              <input className="border p-1 w-16" value={s.number} onChange={e => updateService(s.id, 'number', e.target.value)} placeholder="01" />
              <input className="border p-1 flex-1" value={s.name} onChange={e => updateService(s.id, 'name', e.target.value)} placeholder="Service Name" />
              <button onClick={() => deleteService(s.id)} className="text-red-600 px-2">Delete</button>
            </div>
            <textarea className="border p-1 w-full" rows={2} value={s.description} onChange={e => updateService(s.id, 'description', e.target.value)} />
          </div>
        ))}
      </div>
    </div>
  );
}
INNER_EOF

