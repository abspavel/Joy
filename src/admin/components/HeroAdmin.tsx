import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';
import { compressImage } from '../../utils/imageCompression';

export function HeroAdmin() {
  const [data, setData] = useState<any>({ heading_line1: '', heading_line2: '', tagline_text: '', portrait_image_url: '' });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    supabase.from('hero_content').select('*').eq('id', 1).single().then(({ data }) => {
      if (data) setData(data);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg({ text: '', type: '' });
    const { error } = await supabase.from('hero_content').upsert({ id: 1, ...data });
    setSaving(false);
    if (error) {
      setMsg({ text: `Error saving: ${error.message}`, type: 'error' });
    } else {
      setMsg({ text: 'Saved successfully!', type: 'success' });
    }
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const uploadImage = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    setMsg({ text: '', type: '' });

    try {
      const compressedFile = await compressImage(file, 1600);
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `hero/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('portfolio-media').upload(filePath, compressedFile, { cacheControl: '31536000' });
      
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
        
        // Update the database row directly
        const { error: updateError } = await supabase.from('hero_content').update({ portrait_image_url: publicUrl }).eq('id', 1);
        
        if (!updateError) {
          setData({ ...data, portrait_image_url: publicUrl });
          setMsg({ text: 'Image uploaded successfully!', type: 'success' });
        } else {
          setMsg({ text: `Database update error: ${updateError.message}`, type: 'error' });
        }
      } else {
        setMsg({ text: `Error uploading image: ${uploadError.message}`, type: 'error' });
      }
    } catch (err: any) {
      setMsg({ text: `Error processing image: ${err.message}`, type: 'error' });
    }
    setUploadingImage(false);
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Hero Section</h2>
      
      {msg.text && (
        <div className={`p-3 rounded-md text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {msg.text}
        </div>
      )}

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
        <label className="block text-sm font-medium mb-2">Portrait Image</label>
        {data.portrait_image_url && <img src={data.portrait_image_url} className="h-48 mb-4 bg-[var(--bg-primary)] object-contain rounded border border-gray-200" />}
        <label className={`inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md cursor-pointer text-sm ${uploadingImage ? 'opacity-70 pointer-events-none' : ''}`}>
          {uploadingImage ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : 'Upload Portrait'}
          <input type="file" accept="image/*" className="hidden" onChange={uploadImage} disabled={uploadingImage} />
        </label>
      </div>
      <div className="pt-4 border-t">
        <button onClick={handleSave} disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Text Changes'}
        </button>
      </div>
    </div>
  );
}
