import { invalidatePortfolioCache } from '../../hooks/usePortfolioData';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';
import { compressImage } from '../../utils/imageCompression';

export function CirclePhotosAdmin() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

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
    setMsg({ text: '', type: '' });
    
    try {
      const compressedFile = await compressImage(file, 800); // 800 is enough for circle photos
      const ext = compressedFile.name.split('.').pop();
      const path = `circle/${Math.random()}.${ext}`;
      
      const { error } = await supabase.storage.from('portfolio-media').upload(path, compressedFile, { cacheControl: '31536000' });
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('portfolio-media').getPublicUrl(path);
        const { error: insertError } = await supabase.from('circle_photos').insert([{ image_url: publicUrl, ring, order_index: photos.length }]);
        if (insertError) {
          setMsg({ text: `Error inserting: ${insertError.message}`, type: 'error' });
        } else {
          setMsg({ text: 'Photo uploaded successfully!', type: 'success' });
          fetchPhotos();
        }
      } else {
        setMsg({ text: `Upload error: ${error.message}`, type: 'error' });
      }
    } catch (err: any) {
      setMsg({ text: `Error processing image: ${err.message}`, type: 'error' });
    }
    setUploading(false);
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
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
      
      {msg.text && (
        <div className={`p-3 rounded-md text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {msg.text}
        </div>
      )}
      
      {['outer', 'inner'].map((ring) => (
        <div key={ring} className="space-y-4">
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <h3 className="font-medium capitalize">{ring} Ring</h3>
            <div>
              <label className={`flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded cursor-pointer text-sm ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : `Add to ${ring}`}
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
