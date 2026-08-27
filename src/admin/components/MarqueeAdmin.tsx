import { invalidatePortfolioCache } from '../../hooks/usePortfolioData';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';
import { compressImage } from '../../utils/imageCompression';

export function MarqueeAdmin() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchPhotos = async () => {
    const { data } = await supabase.from('marquee_images').select('*').order('order_index', { ascending: true });
    if (data) setPhotos(data);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const deleteDemoPhotos = async () => {
    if (confirm('Delete all demo/unsplash placeholder photos from database?')) {
      const { error } = await supabase
        .from('marquee_images')
        .delete()
        .like('image_url', '%unsplash.com%');
      if (!error) {
        setMsg({ text: 'Demo photos removed successfully!', type: 'success' });
        fetchPhotos();
      } else {
        setMsg({ text: `Error deleting demo photos: ${error.message}`, type: 'error' });
      }
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    }
  };

  const handleUpload = async (e: any, row_number: number) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMsg({ text: '', type: '' });
    
    try {
      const compressedFile = await compressImage(file, 800); // compress for optimization
      const ext = compressedFile.name.split('.').pop();
      const path = `marquee/${Math.random()}.${ext}`;
      
      const { error } = await supabase.storage.from('portfolio-media').upload(path, compressedFile, { cacheControl: '31536000' });
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('portfolio-media').getPublicUrl(path);
        
        // Count how many are currently in this row to set order_index
        const currentCount = photos.filter(p => p.row_number === row_number).length;
        
        const { error: insertError } = await supabase.from('marquee_images').insert([{ image_url: publicUrl, row_number, order_index: currentCount }]);
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
      await supabase.from('marquee_images').delete().eq('id', id);
      fetchPhotos();
    }
  };

  const hasDemoPhotos = photos.some(p => p.image_url.includes('unsplash.com'));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium">Marquee Slider Photos</h2>
          <p className="text-sm text-gray-500">Manage the photos for the 3 rows. They slide continuously in alternating directions.</p>
        </div>
        {hasDemoPhotos && (
          <button
            onClick={deleteDemoPhotos}
            className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm hover:bg-red-100 transition-colors font-medium self-start sm:self-auto"
          >
            Remove All Demo Photos
          </button>
        )}
      </div>
      
      {msg.text && (
        <div className={`p-3 rounded-md text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {msg.text}
        </div>
      )}
      
      {[1, 2, 3].map((row_number) => (
        <div key={row_number} className="space-y-4">
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <h3 className="font-medium capitalize">Row {row_number} ({row_number === 1 ? 'Top' : row_number === 2 ? 'Middle' : 'Bottom'} - Auto-scrolls {row_number === 2 ? 'Left ←' : 'Right →'})</h3>
            <div>
              <label className={`flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded cursor-pointer text-sm ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : `Add to Row ${row_number}`}
                <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, row_number)} disabled={uploading} />
              </label>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {photos.filter(p => p.row_number === row_number).map(p => (
              <div key={p.id} className="relative group w-32 h-24 bg-gray-100 rounded overflow-hidden">
                <img src={p.image_url} className="w-full h-full object-cover" />
                <button onClick={() => deletePhoto(p.id)} className="absolute top-1 right-1 bg-red-600 text-white p-1 text-xs rounded opacity-0 group-hover:opacity-100">X</button>
              </div>
            ))}
            {photos.filter(p => p.row_number === row_number).length === 0 && (
              <p className="text-sm text-gray-400 p-2">No photos added yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
