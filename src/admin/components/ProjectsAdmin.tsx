import { invalidatePortfolioCache } from '../../hooks/usePortfolioData';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Plus, Trash2, Globe, FileText, Code2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../../utils/imageCompression';

export function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('order_index', { ascending: true });
    if (data) setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async () => {
    const newProj = { 
      project_number: String(projects.length + 1).padStart(2, '0'), 
      name: 'New Project', 
      category: 'Client', 
      description: 'A modern interactive web project built with responsive design and smooth animations.',
      tech_stack: 'React, TypeScript, Tailwind CSS, Motion',
      features: 'Interactive 3D Elements, Responsive Mobile UI, High Performance Animations',
      live_project_url: '',
      col1_image1_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      col1_image2_url: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=800&auto=format&fit=crop',
      col2_image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
      order_index: projects.length 
    };
    
    const { error } = await supabase.from('projects').insert([newProj]);
    if (error) {
      setMsg({ text: `Error: ${error.message}`, type: 'error' });
    } else {
      setMsg({ text: 'Project added successfully!', type: 'success' });
      fetchProjects();
    }
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const updateProject = async (id: string, field: string, value: any) => {
    setSavingId(id);
    await supabase.from('projects').update({ [field]: value }).eq('id', id);
    fetchProjects();
    setTimeout(() => setSavingId(null), 800);
  };

  const deleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        setMsg({ text: `Error deleting: ${error.message}`, type: 'error' });
      } else {
        setMsg({ text: 'Project deleted!', type: 'success' });
        fetchProjects();
      }
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    }
  };

  const handleImageUpload = async (id: string, field: string, file: File) => {
    if (!file) return;
    setUploadingField(`${id}-${field}`);
    setMsg({ text: '', type: '' });
    
    try {
      const compressedFile = await compressImage(file, 1600);
      const ext = compressedFile.name.split('.').pop();
      const path = `projects/${Math.random()}.${ext}`;
      
      const { error } = await supabase.storage.from('portfolio-media').upload(path, compressedFile, { cacheControl: '31536000' });
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('portfolio-media').getPublicUrl(path);
        const { error: updateErr } = await supabase.from('projects').update({ [field]: publicUrl }).eq('id', id);
        if (updateErr) {
          setMsg({ text: `Error saving: ${updateErr.message}`, type: 'error' });
        } else {
          setMsg({ text: 'Image uploaded successfully!', type: 'success' });
          fetchProjects();
        }
      } else {
        setMsg({ text: `Upload error: ${error.message}`, type: 'error' });
      }
    } catch (err: any) {
      setMsg({ text: `Error processing image: ${err.message}`, type: 'error' });
    }
    setUploadingField(null);
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Projects Manager</h2>
          <p className="text-xs text-gray-500">Manage project details, descriptions, tech stack, gallery images, and live preview URLs.</p>
        </div>
        <button 
          onClick={addProject} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {msg.text && (
        <div className={`p-3 rounded-lg text-sm font-medium ${msg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {msg.text}
        </div>
      )}

      <div className="space-y-8">
        {projects.map((p, idx) => (
          <div key={p.id} className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl space-y-6 relative">
            {savingId === p.id && (
              <span className="absolute top-4 right-20 text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Saved
              </span>
            )}
            
            {/* Header / Basic Info */}
            <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 pb-4">
              <div className="w-20">
                <label className="block text-[11px] font-semibold text-gray-500 uppercase">Number</label>
                <input 
                  className="border border-gray-300 rounded-lg p-2 w-full font-mono text-sm font-bold text-gray-800" 
                  value={p.project_number || ''} 
                  onChange={e => updateProject(p.id, 'project_number', e.target.value)} 
                  placeholder="01" 
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-[11px] font-semibold text-gray-500 uppercase">Project Name / Title</label>
                <input 
                  className="border border-gray-300 rounded-lg p-2 w-full text-sm font-semibold text-gray-900" 
                  value={p.name || p.title || ''} 
                  onChange={e => updateProject(p.id, 'name', e.target.value)} 
                  placeholder="Project Name" 
                />
              </div>

              <div className="w-40">
                <label className="block text-[11px] font-semibold text-gray-500 uppercase">Category</label>
                <input 
                  className="border border-gray-300 rounded-lg p-2 w-full text-sm text-gray-700" 
                  value={p.category || ''} 
                  onChange={e => updateProject(p.id, 'category', e.target.value)} 
                  placeholder="e.g. Client, Web App, 3D" 
                />
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => deleteProject(p.id)} 
                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>

            {/* Detailed Description & Overview */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" /> Project Story & Description (Shown in Detail View)
                </label>
                <textarea 
                  rows={3}
                  className="border border-gray-300 rounded-lg p-2.5 w-full text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={p.description || p.overview || ''}
                  onChange={e => updateProject(p.id, 'description', e.target.value)}
                  placeholder="Describe the project goals, architecture, design decisions, and solutions..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1">
                    <Code2 className="w-3.5 h-3.5 text-indigo-600" /> Tech Stack & Tools (Comma-separated)
                  </label>
                  <input 
                    className="border border-gray-300 rounded-lg p-2 w-full text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={p.tech_stack || ''}
                    onChange={e => updateProject(p.id, 'tech_stack', e.target.value)}
                    placeholder="e.g. React 19, Three.js, Tailwind CSS, Vite, Supabase"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Key Features & Highlights (Comma-separated)
                  </label>
                  <input 
                    className="border border-gray-300 rounded-lg p-2 w-full text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={p.features || ''}
                    onChange={e => updateProject(p.id, 'features', e.target.value)}
                    placeholder="e.g. Ultra-smooth 60fps animations, Dark/Light mode, Mobile first"
                  />
                </div>
              </div>

              {/* Live Preview URL */}
              <div className="bg-indigo-50/60 border border-indigo-100 p-3.5 rounded-xl space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                  <Globe className="w-4 h-4 text-indigo-600" /> Live Interactive Preview URL (Embeds inside website + Direct link)
                </label>
                <div className="flex gap-2">
                  <input 
                    className="border border-indigo-200 bg-white rounded-lg p-2 flex-1 text-sm font-mono text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                    value={p.live_project_url || p.live_link || ''} 
                    onChange={e => updateProject(p.id, 'live_project_url', e.target.value)} 
                    placeholder="https://example-project.vercel.app or https://github.com/..." 
                  />
                </div>
                <p className="text-[11px] text-indigo-700">Visitors can interact with this live URL directly inside an interactive device simulator (desktop, tablet, mobile) on your website without leaving the page!</p>
              </div>
            </div>
            
            {/* Gallery Images */}
            <div className="border-t border-gray-100 pt-4">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-3">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-600" /> Project Showcase Images
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <span className="text-[11px] font-semibold text-gray-600">Left Column - Top Image</span>
                  {p.col1_image1_url && <img src={p.col1_image1_url} className="h-28 w-full object-cover rounded-lg bg-gray-200" />}
                  <label className={`block bg-white hover:bg-gray-100 border text-center py-1.5 cursor-pointer text-xs font-medium rounded-lg text-gray-700 transition-colors ${uploadingField === `${p.id}-col1_image1_url` ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploadingField === `${p.id}-col1_image1_url` ? <span className="flex items-center justify-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Uploading</span> : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={e => e.target.files && handleImageUpload(p.id, 'col1_image1_url', e.target.files[0])} className="hidden" />
                  </label>
                  <input 
                    className="border border-gray-200 bg-white p-1 text-[11px] w-full rounded font-mono"
                    placeholder="Or paste URL"
                    value={p.col1_image1_url || ''}
                    onChange={e => updateProject(p.id, 'col1_image1_url', e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <span className="text-[11px] font-semibold text-gray-600">Left Column - Bottom Image</span>
                  {p.col1_image2_url && <img src={p.col1_image2_url} className="h-28 w-full object-cover rounded-lg bg-gray-200" />}
                  <label className={`block bg-white hover:bg-gray-100 border text-center py-1.5 cursor-pointer text-xs font-medium rounded-lg text-gray-700 transition-colors ${uploadingField === `${p.id}-col1_image2_url` ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploadingField === `${p.id}-col1_image2_url` ? <span className="flex items-center justify-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Uploading</span> : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={e => e.target.files && handleImageUpload(p.id, 'col1_image2_url', e.target.files[0])} className="hidden" />
                  </label>
                  <input 
                    className="border border-gray-200 bg-white p-1 text-[11px] w-full rounded font-mono"
                    placeholder="Or paste URL"
                    value={p.col1_image2_url || ''}
                    onChange={e => updateProject(p.id, 'col1_image2_url', e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <span className="text-[11px] font-semibold text-gray-600">Right Column - Large Image</span>
                  {p.col2_image_url && <img src={p.col2_image_url} className="h-28 w-full object-cover rounded-lg bg-gray-200" />}
                  <label className={`block bg-white hover:bg-gray-100 border text-center py-1.5 cursor-pointer text-xs font-medium rounded-lg text-gray-700 transition-colors ${uploadingField === `${p.id}-col2_image_url` ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploadingField === `${p.id}-col2_image_url` ? <span className="flex items-center justify-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Uploading</span> : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={e => e.target.files && handleImageUpload(p.id, 'col2_image_url', e.target.files[0])} className="hidden" />
                  </label>
                  <input 
                    className="border border-gray-200 bg-white p-1 text-[11px] w-full rounded font-mono"
                    placeholder="Or paste URL"
                    value={p.col2_image_url || ''}
                    onChange={e => updateProject(p.id, 'col2_image_url', e.target.value)}
                  />
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

