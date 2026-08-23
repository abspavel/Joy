import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, ArrowUp, ArrowDown, Plus, Loader2 } from 'lucide-react';

export function AchievementsAdmin() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  
  const [newVal, setNewVal] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase.from('achievements').select('*').order('order_index', { ascending: true });
      if (err) throw err;
      setStats(data || []);
    } catch (err: any) {
      showMsg(`Error loading achievements: ${err.message}`, 'error');
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
      const { error: err } = await supabase.from('achievements').insert([{ value: newVal.trim(), label: newLabel.trim(), order_index: newOrder }]);
      if (err) throw err;
      setNewVal('');
      setNewLabel('');
      showMsg('Stat added successfully!', 'success');
      await fetchStats();
    } catch (err: any) {
      showMsg(`Failed to add: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSaving(true);
      const { error: err } = await supabase.from('achievements').delete().eq('id', id);
      if (err) throw err;
      setConfirmDeleteId(null);
      showMsg('Stat deleted successfully!', 'success');
      await fetchStats();
    } catch (err: any) {
      showMsg(`Failed to delete: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === stats.length - 1)) return;
    
    const newStats = [...stats];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const tempOrder = newStats[index].order_index;
    newStats[index].order_index = newStats[targetIndex].order_index;
    newStats[targetIndex].order_index = tempOrder;
    
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
      showMsg(`Failed to reorder: ${err.message}`, 'error');
      await fetchStats();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading stats...</div>;

  return (
    <div className="space-y-8">
      {msg.text && (
        <div className={`p-4 rounded-lg text-sm font-medium ${msg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {msg.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Add Stat / Counter</h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end max-w-2xl">
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Value (e.g. 250+)</label>
            <input type="text" value={newVal} onChange={e => setNewVal(e.target.value)} required placeholder="250+" className="w-full rounded-lg border border-gray-300 p-2 text-sm outline-none focus:border-indigo-500" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Label (e.g. Projects Completed)</label>
            <input type="text" value={newLabel} onChange={e => setNewLabel(e.target.value)} required placeholder="Projects Completed" className="w-full rounded-lg border border-gray-300 p-2 text-sm outline-none focus:border-indigo-500" />
          </div>
          <button type="submit" disabled={saving || !newVal.trim() || !newLabel.trim()} className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
            <Plus size={18} /> Add Stat
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Existing Stats ({stats.length})</h2>
        <div className="space-y-2 max-w-2xl">
          {stats.map((stat, idx) => (
            <div key={stat.id} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-xl text-gray-900">{stat.value}</span>
                <span className="text-gray-600 text-sm">{stat.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleMove(idx, 'up')} disabled={idx === 0 || saving} className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-30 text-gray-600" title="Move up">
                  <ArrowUp size={16} />
                </button>
                <button onClick={() => handleMove(idx, 'down')} disabled={idx === stats.length - 1 || saving} className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-30 text-gray-600" title="Move down">
                  <ArrowDown size={16} />
                </button>
                
                {confirmDeleteId === stat.id ? (
                  <div className="flex items-center gap-1.5 ml-2 bg-red-100 p-1 rounded-md border border-red-200">
                    <span className="text-xs text-red-700 font-bold px-1">Delete?</span>
                    <button
                      onClick={() => handleDelete(stat.id)}
                      disabled={saving}
                      className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDeleteId(stat.id)} disabled={saving} className="p-1.5 hover:bg-red-50 text-red-600 rounded ml-1" title="Delete">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {stats.length === 0 && <p className="text-gray-500 py-4 text-center">No stats found.</p>}
        </div>
      </div>
    </div>
  );
}
