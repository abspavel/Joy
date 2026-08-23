import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2 } from 'lucide-react';

export function MessagesAdmin() {
  const [messages, setMessages] = useState<any[]>([]);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchMessages = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) {
        setMsg({ text: `Error deleting: ${error.message}`, type: 'error' });
      } else {
        setConfirmDeleteId(null);
        setMsg({ text: 'Message deleted!', type: 'success' });
        fetchMessages();
      }
    } catch (err: any) {
      setMsg({ text: `Error: ${err.message}`, type: 'error' });
    }
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Contact Messages</h2>
      </div>

      {msg.text && (
        <div className={`p-3 rounded-md text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {msg.text}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="text-gray-500 text-center py-10 border border-dashed rounded-lg">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="border p-4 rounded-md flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-gray-50">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{m.name}</h3>
                  <a href={`mailto:${m.email}`} className="text-sm text-indigo-600 hover:underline">{m.email}</a>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{m.message}</p>
                <div className="text-xs text-gray-400">
                  {new Date(m.created_at).toLocaleString()}
                </div>
              </div>
              {confirmDeleteId === m.id ? (
                <div className="flex items-center gap-1 bg-red-100 p-1 rounded border border-red-200">
                  <span className="text-xs text-red-700 font-bold px-1">Delete?</span>
                  <button onClick={() => deleteMessage(m.id)} className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold">Yes</button>
                  <button onClick={() => setConfirmDeleteId(null)} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs">No</button>
                </div>
              ) : (
                <button 
                  onClick={() => setConfirmDeleteId(m.id)} 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
