import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';
import { compressImage } from '../../utils/imageCompression';

export function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [uploadingField, setUploadingField] = useState<string | null>(null);

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
      col1_image1_url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      col1_image2_url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      col2_image_url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
      order_index: projects.length 
    };
    
    const { error } = await supabase.from('projects').insert([newProj]);
    if (error) {
      setMsg({ text: `Error: ${error.message}`, type: 'error' });
    } else {
      setMsg({ text: 'Project added!', type: 'success' });
      fetchProjects();
    }
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const updateProject = async (id: string, field: string, value: any) => {
    await supabase.from('projects').update({ [field]: value }).eq('id', id);
    fetchProjects();
  };

  const deleteProject = async (id: string) => {
    if (confirm("Are you sure?")) {
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
      
      const { error } = await supabase.storage.from('portfolio-media').upload(path, compressedFile);
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Projects</h2>
        <button onClick={addProject} className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm">Add Project</button>
      </div>

      {msg.text && (
        <div className={`p-3 rounded-md text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {msg.text}
        </div>
      )}

      <div className="space-y-6">
        {projects.map(p => (
          <div key={p.id} className="border p-4 rounded-md space-y-4">
            <div className="flex gap-4">
              <input className="border p-1 w-16" value={p.project_number} onChange={e => updateProject(p.id, 'project_number', e.target.value)} placeholder="01" />
              <input className="border p-1 flex-1" value={p.name} onChange={e => updateProject(p.id, 'name', e.target.value)} placeholder="Project Name" />
              <select className="border p-1" value={p.category} onChange={e => updateProject(p.id, 'category', e.target.value)}>
                <option value="Client">Client</option>
                <option value="Personal">Personal</option>
              </select>
              <button onClick={() => deleteProject(p.id)} className="text-red-600 px-2">Delete</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-gray-500">Col 1 - Top Image</span>
                {p.col1_image1_url && <img src={p.col1_image1_url} className="h-24 w-full object-cover rounded bg-gray-100" />}
                <label className={`block bg-gray-100 border text-center py-1 cursor-pointer text-xs rounded ${uploadingField === `${p.id}-col1_image1_url` ? 'opacity-50 pointer-events-none' : ''}`}>
                  {uploadingField === `${p.id}-col1_image1_url` ? <span className="flex items-center justify-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Uploading</span> : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={e => e.target.files && handleImageUpload(p.id, 'col1_image1_url', e.target.files[0])} className="hidden" />
                </label>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500">Col 1 - Bottom Image</span>
                {p.col1_image2_url && <img src={p.col1_image2_url} className="h-24 w-full object-cover rounded bg-gray-100" />}
                <label className={`block bg-gray-100 border text-center py-1 cursor-pointer text-xs rounded ${uploadingField === `${p.id}-col1_image2_url` ? 'opacity-50 pointer-events-none' : ''}`}>
                  {uploadingField === `${p.id}-col1_image2_url` ? <span className="flex items-center justify-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Uploading</span> : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={e => e.target.files && handleImageUpload(p.id, 'col1_image2_url', e.target.files[0])} className="hidden" />
                </label>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500">Col 2 - Main Image</span>
                {p.col2_image_url && <img src={p.col2_image_url} className="h-24 w-full object-cover rounded bg-gray-100" />}
                <label className={`block bg-gray-100 border text-center py-1 cursor-pointer text-xs rounded ${uploadingField === `${p.id}-col2_image_url` ? 'opacity-50 pointer-events-none' : ''}`}>
                  {uploadingField === `${p.id}-col2_image_url` ? <span className="flex items-center justify-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Uploading</span> : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={e => e.target.files && handleImageUpload(p.id, 'col2_image_url', e.target.files[0])} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex gap-2 text-sm text-gray-500 items-center">
               Live URL: <input className="border p-1 flex-1" value={p.live_project_url || ''} onChange={e => updateProject(p.id, 'live_project_url', e.target.value)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
