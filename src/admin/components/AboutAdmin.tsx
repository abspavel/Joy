import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function AboutAdmin() {
  const [data, setData] = useState<any>({ heading: '', paragraph_text: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase.from('about_content').select('*').eq('id', 1).single().then(({ data }) => {
      if (data) setData(data);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('about_content').upsert({ id: 1, ...data });
    setSaving(false);
    setMsg(error ? error.message : 'Saved successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">About Section</h2>
      <div>
        <label className="block text-sm font-medium">Heading</label>
        <input className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={data.heading} onChange={e => setData({...data, heading: e.target.value})} />
      </div>
      <div>
        <label className="block text-sm font-medium">Paragraph Text</label>
        <textarea rows={5} className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={data.paragraph_text} onChange={e => setData({...data, paragraph_text: e.target.value})} />
      </div>
      <button onClick={handleSave} disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-md">{saving ? 'Saving...' : 'Save Changes'}</button>
      {msg && <p className="text-sm mt-2 text-green-600">{msg}</p>}
    </div>
  );
}
