cat << 'INNER_EOF' > src/admin/components/CirclePhotosAdmin.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function CirclePhotosAdmin() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchPhotos = async () => {
    const { data } = await supabase.from('circle_photos').select('*').order('order_index', { ascending: true });
    if (data) setPhotos(data);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = async (e: any, ring: 'outer' | 'inner') => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `circle/${Math.random()}.${ext}`;
    
    const { error } = await supabase.storage.from('portfolio-media').upload(path, file);
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('portfolio-media').getPublicUrl(path);
      await supabase.from('circle_photos').insert([{ image_url: publicUrl, ring, order_index: photos.length }]);
      fetchPhotos();
    }
    setUploading(false);
  };

  const deletePhoto = async (id: string) => {
    if (confirm('Delete photo?')) {
      await supabase.from('circle_photos').delete().eq('id', id);
      fetchPhotos();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Circle Photos</h2>
      <p className="text-sm text-gray-500">Outer ring fits ~21 photos. Inner ring fits ~7 photos.</p>
      
      {['outer', 'inner'].map((ring) => (
        <div key={ring} className="space-y-4">
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <h3 className="font-medium capitalize">{ring} Ring</h3>
            <div>
              <label className="bg-indigo-600 text-white px-3 py-1 rounded cursor-pointer text-sm">
                {uploading ? 'Uploading...' : `Add to ${ring}`}
                <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, ring as any)} disabled={uploading} />
              </label>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {photos.filter(p => p.ring === ring).map(p => (
              <div key={p.id} className="relative group w-24 h-32 bg-gray-100 rounded overflow-hidden">
                <img src={p.image_url} className="w-full h-full object-cover" />
                <button onClick={() => deletePhoto(p.id)} className="absolute top-1 right-1 bg-red-600 text-white p-1 text-xs rounded opacity-0 group-hover:opacity-100">X</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
INNER_EOF

cat << 'INNER_EOF' > src/admin/components/CarouselPhotosAdmin.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function CarouselPhotosAdmin() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchPhotos = async () => {
    const { data } = await supabase.from('carousel_photos').select('*').order('order_index', { ascending: true });
    if (data) setPhotos(data);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `carousel/${Math.random()}.${ext}`;
    
    const { error } = await supabase.storage.from('portfolio-media').upload(path, file);
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('portfolio-media').getPublicUrl(path);
      await supabase.from('carousel_photos').insert([{ image_url: publicUrl, order_index: photos.length }]);
      fetchPhotos();
    }
    setUploading(false);
  };

  const updateCaption = async (id: string, caption: string) => {
    await supabase.from('carousel_photos').update({ caption }).eq('id', id);
  };

  const deletePhoto = async (id: string) => {
    if (confirm('Delete photo?')) {
      await supabase.from('carousel_photos').delete().eq('id', id);
      fetchPhotos();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Carousel Photos</h2>
        <label className="bg-indigo-600 text-white px-3 py-1 rounded cursor-pointer text-sm">
          {uploading ? 'Uploading...' : 'Add Photo'}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map(p => (
          <div key={p.id} className="border p-2 rounded space-y-2">
            <div className="relative w-full aspect-[3/4] bg-gray-100 rounded overflow-hidden">
              <img src={p.image_url} className="w-full h-full object-cover" />
              <button onClick={() => deletePhoto(p.id)} className="absolute top-2 right-2 bg-red-600 text-white p-1 px-2 text-xs rounded">Delete</button>
            </div>
            <input 
              type="text" 
              placeholder="Caption (e.g. Joy 1)" 
              className="w-full border p-1 text-sm rounded"
              defaultValue={p.caption || ''}
              onBlur={e => updateCaption(p.id, e.target.value)}
            />
          </div>
        ))}
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
import { CirclePhotosAdmin } from './components/CirclePhotosAdmin';
import { CarouselPhotosAdmin } from './components/CarouselPhotosAdmin';

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
          {activeTab === 'Circle Photos' && <CirclePhotosAdmin />}
          {activeTab === 'Carousel' && <CarouselPhotosAdmin />}
        </main>
      </div>
    </div>
  );
}
INNER_EOF
