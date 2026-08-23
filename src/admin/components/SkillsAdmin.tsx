import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Edit2, Check, X, ArrowUp, ArrowDown, Plus, Loader2 } from 'lucide-react';

export function SkillsAdmin() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase.from('skills').select('*').order('order_index', { ascending: true });
      if (err) throw err;
      setSkills(data || []);
    } catch (err: any) {
      showMsg(`Error loading skills: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      setSaving(true);
      const newOrder = skills.length > 0 ? Math.max(...skills.map(s => s.order_index || 0)) + 1 : 0;
      const { error: err } = await supabase.from('skills').insert([{ name: newSkillName.trim(), order_index: newOrder }]);
      if (err) throw err;
      setNewSkillName('');
      showMsg('Skill added successfully!', 'success');
      await fetchSkills();
    } catch (err: any) {
      showMsg(`Failed to add skill: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSaving(true);
      const { error: err } = await supabase.from('skills').delete().eq('id', id);
      if (err) throw err;
      setConfirmDeleteId(null);
      showMsg('Skill deleted successfully!', 'success');
      await fetchSkills();
    } catch (err: any) {
      showMsg(`Failed to delete skill: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    try {
      setSaving(true);
      const { error: err } = await supabase.from('skills').update({ name: editName.trim() }).eq('id', id);
      if (err) throw err;
      setEditingId(null);
      showMsg('Skill updated successfully!', 'success');
      await fetchSkills();
    } catch (err: any) {
      showMsg(`Failed to update skill: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === skills.length - 1)) return;
    
    const newSkills = [...skills];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const tempOrder = newSkills[index].order_index;
    newSkills[index].order_index = newSkills[targetIndex].order_index;
    newSkills[targetIndex].order_index = tempOrder;
    
    const temp = newSkills[index];
    newSkills[index] = newSkills[targetIndex];
    newSkills[targetIndex] = temp;
    setSkills(newSkills);

    try {
      setSaving(true);
      await Promise.all([
        supabase.from('skills').update({ order_index: newSkills[index].order_index }).eq('id', newSkills[index].id),
        supabase.from('skills').update({ order_index: newSkills[targetIndex].order_index }).eq('id', newSkills[targetIndex].id)
      ]);
    } catch (err: any) {
      showMsg(`Failed to reorder: ${err.message}`, 'error');
      await fetchSkills();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading skills...</div>;

  return (
    <div className="space-y-8">
      {msg.text && (
        <div className={`p-4 rounded-lg text-sm font-medium ${msg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {msg.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Skill</h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end max-w-xl">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name (e.g. React, TypeScript, Next.js)</label>
            <input 
              type="text" 
              value={newSkillName} 
              onChange={e => setNewSkillName(e.target.value)} 
              required 
              placeholder="Enter skill title..."
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <button 
            type="submit" 
            disabled={saving || !newSkillName.trim()} 
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Plus size={18} /> Add Skill
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Skills ({skills.length})</h2>
          <span className="text-xs text-gray-500">Reorder with arrows, edit name or delete</span>
        </div>
        
        <div className="space-y-2 max-w-3xl">
          {skills.map((skill, idx) => (
            <div key={skill.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100/80 rounded-lg border border-gray-200 gap-3 transition-colors">
              {editingId === skill.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="flex-1 rounded-md border border-indigo-400 px-3 py-1.5 text-sm outline-none bg-white"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(skill.id)}
                    disabled={saving || !editName.trim()}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-medium flex items-center gap-1"
                    title="Save"
                  >
                    <Check size={16} /> Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md text-xs font-medium"
                    title="Cancel"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400 w-5">{idx + 1}.</span>
                  <span className="font-semibold text-gray-800 text-base">{skill.name}</span>
                </div>
              )}

              {editingId !== skill.id && (
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button 
                    onClick={() => handleMove(idx, 'up')} 
                    disabled={idx === 0 || saving} 
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30 transition-colors"
                    title="Move up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button 
                    onClick={() => handleMove(idx, 'down')} 
                    disabled={idx === skills.length - 1 || saving} 
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30 transition-colors"
                    title="Move down"
                  >
                    <ArrowDown size={16} />
                  </button>
                  
                  <button
                    onClick={() => {
                      setEditingId(skill.id);
                      setEditName(skill.name);
                    }}
                    className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors ml-1"
                    title="Edit Name"
                  >
                    <Edit2 size={16} />
                  </button>

                  {confirmDeleteId === skill.id ? (
                    <div className="flex items-center gap-1.5 ml-2 bg-red-100 p-1 rounded-md border border-red-200">
                      <span className="text-xs text-red-700 font-medium px-1">Delete?</span>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        disabled={saving}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold"
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
                      onClick={() => setConfirmDeleteId(skill.id)} 
                      disabled={saving} 
                      className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors ml-1"
                      title="Delete skill"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
          {skills.length === 0 && <p className="text-gray-500 text-center py-6">No skills found. Add some above to display on your site.</p>}
        </div>
      </div>
    </div>
  );
}
