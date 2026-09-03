import { invalidatePortfolioCache } from '../../hooks/usePortfolioData';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';
import { EditableField } from './EditableField';
import { compressImage } from '../../utils/imageCompression';

export function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('order_index', { ascending: true });
    if (data) setTestimonials(data);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const addTestimonial = async () => {
    const newItem = { 
      client_name: 'New Client', 
      client_role: 'CEO', 
      rating: 5,
      review_text: 'Excellent work!',
      order_index: testimonials.length 
    };
    
    const { error } = await supabase.from('testimonials').insert([newItem]);
    if (error) {
      setMsg({ text: `Error: ${error.message}`, type: 'error' });
    } else {
      setMsg({ text: 'Testimonial added!', type: 'success' });
      fetchTestimonials();
    }
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const updateTestimonial = async (id: string, field: string, value: any) => {
    await supabase.from('testimonials').update({ [field]: value }).eq('id', id);
    fetchTestimonials();
  };

  const deleteTestimonial = async (id: string) => {
    if (confirm("Are you sure?")) {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) {
        setMsg({ text: `Error deleting: ${error.message}`, type: 'error' });
      } else {
        setMsg({ text: 'Testimonial deleted!', type: 'success' });
        fetchTestimonials();
      }
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    }
  };

  const handleImageUpload = async (id: string, file: File) => {
    if (!file) return;
    setUploadingField(id);
    setMsg({ text: '', type: '' });
    
    try {
      const compressedFile = await compressImage(file, 800);
      const ext = compressedFile.name.split('.').pop();
      const path = `testimonials/${Math.random()}.${ext}`;
      
      const { error } = await supabase.storage.from('portfolio-media').upload(path, compressedFile, { cacheControl: '31536000' });
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('portfolio-media').getPublicUrl(path);
        const { error: updateErr } = await supabase.from('testimonials').update({ client_photo_url: publicUrl }).eq('id', id);
        if (updateErr) {
          setMsg({ text: `Error saving: ${updateErr.message}`, type: 'error' });
        } else {
          setMsg({ text: 'Photo uploaded successfully!', type: 'success' });
          fetchTestimonials();
        }
      } else {
        setMsg({ text: `Error uploading: ${error.message}`, type: 'error' });
      }
    } catch (err: any) {
      setMsg({ text: `Compression error: ${err.message}`, type: 'error' });
    } finally {
      setUploadingField(null);
    }
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Testimonials</h2>
        <button onClick={addTestimonial} className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm">Add Testimonial</button>
      </div>

      {msg.text && (
        <div className={`p-3 rounded-md text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {msg.text}
        </div>
      )}

      <div className="space-y-6">
        {testimonials.map((t) => (
          <div key={t.id} className="border p-4 rounded-md space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <EditableField className="border p-1 flex-1 text-sm rounded" value={t.client_name} onSave={val => updateTestimonial(t.id, 'client_name', val)} placeholder="Client Name" />
                  <EditableField className="border p-1 flex-1 text-sm rounded" value={t.client_role || ''} onSave={val => updateTestimonial(t.id, 'client_role', val)} placeholder="Client Role" />
                  <select className="border p-1 text-sm rounded" value={t.rating} onChange={e => updateTestimonial(t.id, 'rating', parseInt(e.target.value))}>
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <EditableField type="textarea" className="w-full border p-2 text-sm rounded" rows={3} value={t.review_text} onSave={val => updateTestimonial(t.id, 'review_text', val)} placeholder="Review Text" />
              </div>
              <div className="flex flex-col gap-2 items-center w-24 shrink-0">
                 {t.client_photo_url ? (
                   <img src={t.client_photo_url} className="w-16 h-16 rounded-full object-cover border" />
                 ) : (
                   <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400 border text-center leading-tight">No photo</div>
                 )}
                 <label className={`text-xs cursor-pointer bg-gray-100 px-2 py-1 rounded border hover:bg-gray-200 ${uploadingField === t.id ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploadingField === t.id ? <Loader2 className="w-3 h-3 animate-spin inline mr-1" /> : null}
                    {uploadingField === t.id ? 'Uploading' : 'Upload'}
                    <input type="file" accept="image/*" onChange={e => e.target.files && handleImageUpload(t.id, e.target.files[0])} className="hidden" />
                 </label>
              </div>
              <button onClick={() => deleteTestimonial(t.id)} className="text-red-600 px-2 py-1 hover:bg-red-50 rounded">Delete</button>
            </div>
            <div className="flex gap-2 text-sm text-gray-500 items-center">
               Order: <EditableField type="number" className="border p-1 w-16 rounded" value={t.order_index} onSave={val => updateTestimonial(t.id, 'order_index', parseInt(val))} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
