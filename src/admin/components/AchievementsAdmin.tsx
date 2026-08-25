import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function AchievementsAdmin() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [newVal, setNewVal] = useState('');
  const [newLabel, setNewLabel] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase.from('achievements').select('*').order('order_index', { ascending: true });
      if (err) throw err;
      setStats(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVal.trim() || !newLabel.trim()) return;
    try {
      setSaving(true);
      const newOrder = stats.length > 0 ? Math.max(...stats.map(s => s.order_index || 0)) + 1 : 0;
      const { error: err } = await supabase.from('achievements').insert([{ value: newVal, label: newLabel, order_index: newOrder }]);
      if (err) throw err;
      setNewVal('');
      setNewLabel('');
      await fetchStats();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      setSaving(true);
      const { error: err } = await supabase.from('achievements').delete().eq('id', id);
      if (err) throw err;
      await fetchStats();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === stats.length - 1)) return;
    
    const newStats = [...stats];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap order_index
    const tempOrder = newStats[index].order_index;
    newStats[index].order_index = newStats[targetIndex].order_index;
    newStats[targetIndex].order_index = tempOrder;
    
    // Swap in array for optimistic UI
    const temp = newStats[index];
    newStats[index] = newStats[targetIndex];
    newStats[targetIndex] = temp;
    setStats(newStats);

    try {
      setSaving(true);
      await Promise.all([
        supabase.from('achievements').update({ order_index: newStats[index].order_index }).eq('id', newStats[index].id),
        supabase.from('achievements').update({ order_index: newStats[targetIndex].order_index }).eq('id', newStats[targetIndex].id)
      ]);
    } catch (err: any) {
      alert(err.message);
      await fetchStats(); // revert on error
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium mb-4">Add Stat</h2>
        <form onSubmit={handleAdd} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Value (e.g. 250+)</label>
            <input type="text" value={newVal} onChange={e => setNewVal(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Label (e.g. Projects Completed)</label>
            <input type="text" value={newLabel} onChange={e => setNewLabel(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
          </div>
          <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
            Add
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Existing Stats</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="space-y-2">
          {stats.map((stat, idx) => (
            <div key={stat.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <div>
                <span className="font-bold mr-2 text-xl">{stat.value}</span>
                <span className="text-gray-600">{stat.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleMove(idx, 'up')} disabled={idx === 0 || saving} className="p-1 hover:bg-gray-200 rounded disabled:opacity-50">↑</button>
                <button onClick={() => handleMove(idx, 'down')} disabled={idx === stats.length - 1 || saving} className="p-1 hover:bg-gray-200 rounded disabled:opacity-50">↓</button>
                <button onClick={() => handleDelete(stat.id)} disabled={saving} className="text-red-600 hover:text-red-800 ml-4">Delete</button>
              </div>
            </div>
          ))}
          {stats.length === 0 && <p className="text-gray-500">No stats found.</p>}
        </div>
      </div>
    </div>
  );
}
