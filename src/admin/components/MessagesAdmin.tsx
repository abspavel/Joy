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

  const deleteMessage = async (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) {
        setMsg({ text: `Error deleting: ${error.message}`, type: 'error' });
      } else {
        setMsg({ text: 'Message deleted!', type: 'success' });
        fetchMessages();
      }
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    }
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
              <button 
                onClick={() => deleteMessage(m.id)} 
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                title="Delete message"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
