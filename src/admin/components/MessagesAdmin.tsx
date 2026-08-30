import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Mail, MessageSquare, RefreshCw, Phone, MessageCircle } from 'lucide-react';

export function MessagesAdmin() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [activeFilter, setActiveFilter] = useState<'all' | 'inquiry' | 'newsletter'>('all');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setMessages(data);
      } else if (error) {
        setMsg({ text: `Failed to load messages: ${error.message}`, type: 'error' });
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  const isNewsletter = (m: any) => {
    return (
      (m.name && m.name.toLowerCase().includes('newsletter')) ||
      (m.message && m.message.toLowerCase().includes('newsletter'))
    );
  };

  const counts = useMemo(() => {
    const newsletterCount = messages.filter(isNewsletter).length;
    const inquiryCount = messages.length - newsletterCount;
    return { all: messages.length, inquiry: inquiryCount, newsletter: newsletterCount };
  }, [messages]);

  const filteredMessages = useMemo(() => {
    if (activeFilter === 'inquiry') {
      return messages.filter(m => !isNewsletter(m));
    }
    if (activeFilter === 'newsletter') {
      return messages.filter(isNewsletter);
    }
    return messages;
  }, [messages, activeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Contact Messages</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Direct messages submitted from the contact page and newsletter subscriptions.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMessages}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            activeFilter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({counts.all})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('inquiry')}
          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            activeFilter === 'inquiry'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Inquiries ({counts.inquiry})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('newsletter')}
          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            activeFilter === 'newsletter'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Newsletter ({counts.newsletter})
        </button>
      </div>

      {msg.text && (
        <div className={`p-3 rounded-md text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {msg.text}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500 text-center py-10 border border-dashed rounded-lg flex flex-col items-center gap-2">
          <div className="w-5 h-5 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <span className="text-xs">Loading messages...</span>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-gray-500 text-center py-10 border border-dashed rounded-lg">
          No messages found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((m) => {
            const newsletter = isNewsletter(m);
            const phone = (m.phone && typeof m.phone === 'string' && m.phone.trim()) 
              ? m.phone.trim() 
              : (m.message && typeof m.message === 'string' && m.message.match(/^Phone:\s*([^\n\r]+)/i))
                ? m.message.match(/^Phone:\s*([^\n\r]+)/i)[1].trim()
                : null;
            
            const cleanMessage = m.message 
              ? m.message.replace(/^Phone:\s*[^\n\r]+\s*\n*/i, '').trim()
              : '';

            return (
              <div key={m.id} className="border p-4 rounded-md flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-gray-50 hover:bg-gray-100/60 transition-colors">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{m.name}</h3>
                    {newsletter ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                        <Mail className="w-3 h-3" /> Newsletter Subscriber
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <MessageSquare className="w-3 h-3" /> Contact Inquiry
                      </span>
                    )}
                    <a href={`mailto:${m.email}`} className="text-sm text-indigo-600 hover:underline">{m.email}</a>
                  </div>

                  {phone && (
                    <div className="flex flex-wrap items-center gap-2">
                      <a 
                        href={`tel:${phone.replace(/[^\d+]/g, '')}`} 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                        title="Click to call"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{phone}</span>
                      </a>
                      <a 
                        href={`https://wa.me/${phone.replace(/[^\d]/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3 text-green-600" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  )}

                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{cleanMessage || m.message}</p>
                  <div className="text-xs text-gray-400">
                    {new Date(m.created_at).toLocaleString()}
                  </div>
                </div>
                <button 
                  onClick={() => deleteMessage(m.id)} 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors cursor-pointer"
                  title="Delete message"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
