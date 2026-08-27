import { invalidatePortfolioCache } from '../../hooks/usePortfolioData';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { compressImage } from '../../utils/imageCompression';

export function CertificationsAdmin() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newIssuer, setNewIssuer] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase.from('certifications').select('*').order('order_index', { ascending: true });
      if (err) throw err;
      setCerts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const compressedFile = await compressImage(file, 1600);
    const fileExt = compressedFile.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `certifications/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-media')
      .upload(filePath, compressedFile, { cacheControl: '31536000' });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('portfolio-media')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newIssuer.trim() || !newImage) return;

    try {
      setSaving(true);
      setUploading(true);

      const imageUrl = await uploadImage(newImage);
      const newOrder = certs.length > 0 ? Math.max(...certs.map(s => s.order_index || 0)) + 1 : 0;
      
      const payload: any = {
        title: newTitle,
        issuer: newIssuer,
        image_url: imageUrl,
        order_index: newOrder
      };

      if (newDate) {
        payload.issue_date = newDate;
      }

      const { error: err } = await supabase.from('certifications').insert([payload]);
      if (err) throw err;

      setNewTitle('');
      setNewIssuer('');
      setNewDate('');
      setNewImage(null);
      (document.getElementById('cert-image-upload') as HTMLInputElement).value = '';

      undefined
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    try {
      setSaving(true);
      
      // Try to delete image from storage
      try {
        if (imageUrl && imageUrl.includes('portfolio-media')) {
          const path = imageUrl.split('portfolio-media/')[1];
          if (path) {
            await supabase.storage.from('portfolio-media').remove([path]);
          }
        }
      } catch (e) {
        console.error("Error removing image:", e);
      }

      const { error: err } = await supabase.from('certifications').delete().eq('id', id);
      if (err) throw err;
      undefined
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === certs.length - 1)) return;
    
    const newCerts = [...certs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const tempOrder = newCerts[index].order_index;
    newCerts[index].order_index = newCerts[targetIndex].order_index;
    newCerts[targetIndex].order_index = tempOrder;
    
    const temp = newCerts[index];
    newCerts[index] = newCerts[targetIndex];
    newCerts[targetIndex] = temp;
    setCerts(newCerts);

    try {
      setSaving(true);
      await Promise.all([
        supabase.from('certifications').update({ order_index: newCerts[index].order_index }).eq('id', newCerts[index].id),
        supabase.from('certifications').update({ order_index: newCerts[targetIndex].order_index }).eq('id', newCerts[targetIndex].id)
      ]);
    } catch (err: any) {
      alert(err.message);
      undefined
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading certifications...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-medium mb-6">Add Certification</h2>
        <form onSubmit={handleAdd} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700">Certificate Title</label>
            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" placeholder="e.g. AWS Certified Solutions Architect" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Issuing Organization</label>
            <input type="text" value={newIssuer} onChange={e => setNewIssuer(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" placeholder="e.g. Amazon Web Services" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Issue Date (Optional)</label>
            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Certificate Image (Required)</label>
            <input id="cert-image-upload" type="file" accept="image/*" onChange={handleImageChange} required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          </div>
          
          <button type="submit" disabled={saving || uploading || !newImage} className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50 mt-4 font-medium">
            {uploading ? 'Uploading & Saving...' : 'Add Certification'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-4">Existing Certifications</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certs.map((cert, idx) => (
            <div key={cert.id} className="flex flex-col bg-gray-50 rounded-lg border overflow-hidden">
              <div className="h-40 bg-gray-200 overflow-hidden relative">
                <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg leading-tight mb-1">{cert.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{cert.issuer}</p>
                {cert.issue_date && <p className="text-gray-500 text-xs mb-4">Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>}
                
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-200">
                  <button onClick={() => handleMove(idx, 'up')} disabled={idx === 0 || saving} className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-100 rounded disabled:opacity-50 text-gray-600 text-sm">Move Up</button>
                  <button onClick={() => handleMove(idx, 'down')} disabled={idx === certs.length - 1 || saving} className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-100 rounded disabled:opacity-50 text-gray-600 text-sm">Move Down</button>
                  <button onClick={() => handleDelete(cert.id, cert.image_url)} disabled={saving} className="text-red-600 hover:text-red-800 ml-auto text-sm font-medium">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {certs.length === 0 && <p className="text-gray-500 col-span-2">No certifications found. Add some above.</p>}
        </div>
      </div>
    </div>
  );
}
