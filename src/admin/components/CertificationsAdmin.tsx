import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { compressImage } from '../../utils/imageCompression';
import { Trash2, Edit2, Plus, ArrowUp, ArrowDown, Loader2, Check, X, Award } from 'lucide-react';

export function CertificationsAdmin() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });

  const [newTitle, setNewTitle] = useState('');
  const [newIssuer, setNewIssuer] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingCert, setEditingCert] = useState<any | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);

  useEffect(() => {
    fetchCerts();
  }, []);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const fetchCerts = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase.from('certifications').select('*').order('order_index', { ascending: true });
      if (err) throw err;
      setCerts(data || []);
    } catch (err: any) {
      showMsg(`Error loading certifications: ${err.message}`, 'error');
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
        title: newTitle.trim(),
        issuer: newIssuer.trim(),
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
      const fileInput = document.getElementById('cert-image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      showMsg('Certification added successfully!', 'success');
      await fetchCerts();
    } catch (err: any) {
      showMsg(`Failed to add certification: ${err.message}`, 'error');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    try {
      setSaving(true);
      
      // Attempt image cleanup
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

      setConfirmDeleteId(null);
      showMsg('Certification deleted successfully!', 'success');
      await fetchCerts();
    } catch (err: any) {
      showMsg(`Failed to delete certification: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert || !editingCert.title.trim() || !editingCert.issuer.trim()) return;

    try {
      setSaving(true);
      setUploading(true);

      let imageUrl = editingCert.image_url;
      if (editImage) {
        imageUrl = await uploadImage(editImage);
      }

      const payload: any = {
        title: editingCert.title.trim(),
        issuer: editingCert.issuer.trim(),
        image_url: imageUrl,
        issue_date: editingCert.issue_date || null
      };

      const { error: err } = await supabase.from('certifications').update(payload).eq('id', editingCert.id);
      if (err) throw err;

      setEditingCert(null);
      setEditImage(null);
      showMsg('Certification updated successfully!', 'success');
      await fetchCerts();
    } catch (err: any) {
      showMsg(`Failed to update certification: ${err.message}`, 'error');
    } finally {
      setSaving(false);
      setUploading(false);
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
      showMsg(`Failed to reorder: ${err.message}`, 'error');
      await fetchCerts();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading certifications...</div>;

  return (
    <div className="space-y-8">
      {msg.text && (
        <div className={`p-4 rounded-lg text-sm font-medium ${msg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {msg.text}
        </div>
      )}

      {/* Edit Modal */}
      {editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Certification</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingCert.title}
                  onChange={e => setEditingCert({ ...editingCert, title: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
                <input
                  type="text"
                  value={editingCert.issuer}
                  onChange={e => setEditingCert({ ...editingCert, issuer: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date (Optional)</label>
                <input
                  type="date"
                  value={editingCert.issue_date || ''}
                  onChange={e => setEditingCert({ ...editingCert, issue_date: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Change Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => e.target.files && setEditImage(e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => { setEditingCert(null); setEditImage(null); }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Award className="text-indigo-600" /> Add Certification
        </h2>
        <form onSubmit={handleAdd} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Title</label>
            <input 
              type="text" 
              value={newTitle} 
              onChange={e => setNewTitle(e.target.value)} 
              required 
              className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 outline-none" 
              placeholder="e.g. Next Level Web Development Course" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
            <input 
              type="text" 
              value={newIssuer} 
              onChange={e => setNewIssuer(e.target.value)} 
              required 
              className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 outline-none" 
              placeholder="e.g. Programming Hero" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date (Optional)</label>
            <input 
              type="date" 
              value={newDate} 
              onChange={e => setNewDate(e.target.value)} 
              className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Image (Required)</label>
            <input 
              id="cert-image-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              required 
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={saving || uploading || !newImage} 
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium transition-colors shadow-sm"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading & Compressing...
              </>
            ) : (
              <>
                <Plus size={18} /> Add Certification
              </>
            )}
          </button>
        </form>
      </div>

      {/* Certifications List */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Existing Certifications ({certs.length})</h2>
          <span className="text-xs text-gray-500">Reorder with arrows or delete</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certs.map((cert, idx) => (
            <div key={cert.id} className="flex flex-col bg-gray-50 rounded-xl border border-gray-200 overflow-hidden group hover:border-gray-300 transition-all shadow-xs">
              <div className="h-44 bg-gray-200 overflow-hidden relative">
                <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 leading-snug mb-1">{cert.title}</h3>
                  <p className="text-gray-600 text-sm font-medium mb-1">{cert.issuer}</p>
                  {cert.issue_date && <p className="text-gray-400 text-xs mb-3">Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-2">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleMove(idx, 'up')} 
                      disabled={idx === 0 || saving} 
                      className="p-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30"
                      title="Move up"
                    >
                      <ArrowUp size={15} />
                    </button>
                    <button 
                      onClick={() => handleMove(idx, 'down')} 
                      disabled={idx === certs.length - 1 || saving} 
                      className="p-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30"
                      title="Move down"
                    >
                      <ArrowDown size={15} />
                    </button>
                    <button 
                      onClick={() => setEditingCert(cert)} 
                      className="p-1.5 bg-white border border-gray-300 hover:bg-blue-50 text-blue-600 rounded ml-1"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                  </div>

                  {confirmDeleteId === cert.id ? (
                    <div className="flex items-center gap-1.5 bg-red-100 p-1 rounded-md border border-red-200">
                      <span className="text-xs text-red-700 font-bold px-1">Delete?</span>
                      <button
                        onClick={() => handleDelete(cert.id, cert.image_url)}
                        disabled={saving}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setConfirmDeleteId(cert.id)} 
                      disabled={saving} 
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-semibold py-1 px-2.5 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {certs.length === 0 && (
            <p className="text-gray-500 col-span-2 text-center py-8">No certifications found. Add some above to display on your site.</p>
          )}
        </div>
      </div>
    </div>
  );
}
