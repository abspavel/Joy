import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';
import { compressImage } from '../../utils/imageCompression';

export function CarouselPhotosAdmin() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

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
    setMsg({ text: '', type: '' });
    
    try {
      const compressedFile = await compressImage(file, 1200); // 1200 is enough for carousel
      const ext = compressedFile.name.split('.').pop();
      const path = `carousel/${Math.random()}.${ext}`;
      
      const { error } = await supabase.storage.from('portfolio-media').upload(path, compressedFile, { cacheControl: '31536000' });
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('portfolio-media').getPublicUrl(path);
        const { error: insertError } = await supabase.from('carousel_photos').insert([{ image_url: publicUrl, order_index: photos.length }]);
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

  const updateCaption = async (id: string, caption: string) => {
    await supabase.from('carousel_photos').update({ caption }).eq('id', id);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const deletePhoto = async (id: string) => {
    try {
      const { error } = await supabase.from('carousel_photos').delete().eq('id', id);
      if (error) {
        setMsg({ text: `Delete error: ${error.message}`, type: 'error' });
      } else {
        setConfirmDeleteId(null);
        setMsg({ text: 'Photo deleted successfully!', type: 'success' });
        fetchPhotos();
      }
    } catch (err: any) {
      setMsg({ text: `Delete error: ${err.message}`, type: 'error' });
    }
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Carousel Photos</h2>
        <label className={`flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded cursor-pointer text-sm ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
          {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : 'Add Photo'}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {msg.text && (
        <div className={`p-3 rounded-md text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {msg.text}
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map(p => (
          <div key={p.id} className="border p-2 rounded space-y-2">
            <div className="relative w-full aspect-[3/4] bg-gray-100 rounded overflow-hidden">
              <img src={p.image_url} className="w-full h-full object-cover" />
              {confirmDeleteId === p.id ? (
                <div className="absolute top-2 right-2 bg-red-100 p-1 rounded border border-red-200 flex items-center gap-1 z-10">
                  <span className="text-[10px] text-red-700 font-bold px-1">Delete?</span>
                  <button onClick={() => deletePhoto(p.id)} className="px-2 py-0.5 bg-red-600 text-white rounded text-xs font-bold">Yes</button>
                  <button onClick={() => setConfirmDeleteId(null)} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">No</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDeleteId(p.id)} className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600 text-white p-1 px-2 text-xs rounded shadow">Delete</button>
              )}
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
