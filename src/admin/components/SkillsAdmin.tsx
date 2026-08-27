import { invalidatePortfolioCache } from '../../hooks/usePortfolioData';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function SkillsAdmin() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase.from('skills').select('*').order('order_index', { ascending: true });
      if (err) throw err;
      setSkills(data || []);
    } catch (err: any) {
      setError(err.message);
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
      const { error: err } = await supabase.from('skills').insert([{ name: newSkillName, order_index: newOrder }]);
      if (err) throw err;
      setNewSkillName('');
      undefined
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      setSaving(true);
      const { error: err } = await supabase.from('skills').delete().eq('id', id);
      if (err) throw err;
      undefined
    } catch (err: any) {
      alert(err.message);
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
      alert(err.message);
      undefined
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading skills...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium mb-4">Add Skill</h2>
        <form onSubmit={handleAdd} className="flex gap-4 items-end max-w-xl">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Skill Name (e.g. React, TypeScript)</label>
            <input type="text" value={newSkillName} onChange={e => setNewSkillName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
          </div>
          <button type="submit" disabled={saving || !newSkillName.trim()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
            Add Skill
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Existing Skills</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="space-y-2 max-w-2xl">
          {skills.map((skill, idx) => (
            <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <span className="font-medium text-lg">{skill.name}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleMove(idx, 'up')} disabled={idx === 0 || saving} className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 text-gray-600">↑</button>
                <button onClick={() => handleMove(idx, 'down')} disabled={idx === skills.length - 1 || saving} className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 text-gray-600">↓</button>
                <button onClick={() => handleDelete(skill.id)} disabled={saving} className="text-red-600 hover:text-red-800 ml-4 px-2 py-1">Delete</button>
              </div>
            </div>
          ))}
          {skills.length === 0 && <p className="text-gray-500">No skills found. Add some to display them on your site.</p>}
        </div>
      </div>
    </div>
  );
}
