import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Mail, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Plus, 
  Search, 
  UserCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { NewsletterSubscriber } from '../../types';

export function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  
  // Add subscriber modal / form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchSubscribers = async () => {
    setLoading(true);
    const emailMap = new Map<string, NewsletterSubscriber>();

    try {
      // 1. Fetch from contact_messages where name indicates newsletter or message contains newsletter
      const { data: messagesData, error: msgError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (messagesData && !msgError) {
        messagesData.forEach((m: any) => {
          const isNewsletter = 
            (m.name && m.name.toLowerCase().includes('newsletter')) ||
            (m.message && m.message.toLowerCase().includes('newsletter'));

          if (isNewsletter && m.email) {
            const clean = m.email.trim().toLowerCase();
            if (!emailMap.has(clean)) {
              emailMap.set(clean, {
                id: m.id,
                email: clean,
                created_at: m.created_at,
                source: 'Website Footer',
                message_id: m.id
              });
            }
          }
        });
      }

      // 2. Fetch from newsletter_subscribers table if it exists
      try {
        const { data: subData, error: subError } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('created_at', { ascending: false });

        if (subData && !subError) {
          subData.forEach((s: any) => {
            if (s.email) {
              const clean = s.email.trim().toLowerCase();
              const existing = emailMap.get(clean);
              if (existing) {
                // Attach id if not already
                emailMap.set(clean, {
                  ...existing,
                  id: s.id || existing.id
                });
              } else {
                emailMap.set(clean, {
                  id: s.id,
                  email: clean,
                  created_at: s.created_at || new Date().toISOString(),
                  source: 'Direct Subscription'
                });
              }
            }
          });
        }
      } catch (err) {
        // Optional table may not exist
      }

      // 3. Merge with localStorage subscribers
      try {
        const localSaved = JSON.parse(localStorage.getItem('portfolio_newsletter_subscribers') || '[]');
        if (Array.isArray(localSaved)) {
          localSaved.forEach((localItem: any) => {
            if (localItem.email) {
              const clean = localItem.email.trim().toLowerCase();
              if (!emailMap.has(clean)) {
                emailMap.set(clean, {
                  id: localItem.id || 'local_' + Math.random().toString(36).substr(2, 9),
                  email: clean,
                  created_at: localItem.created_at || new Date().toISOString(),
                  source: localItem.source || 'Website Footer (Local)'
                });
              }
            }
          });
        }
      } catch (e) {
        console.warn('Could not read local newsletter subscribers:', e);
      }

      const list = Array.from(emailMap.values()).sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setSubscribers(list);
    } catch (err: any) {
      console.error('Error fetching subscribers:', err);
      setMsg({ text: 'Failed to fetch subscribers', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Filtered subscribers by search query
  const filteredSubscribers = useMemo(() => {
    if (!searchQuery.trim()) return subscribers;
    const q = searchQuery.toLowerCase().trim();
    return subscribers.filter(s => s.email.toLowerCase().includes(q));
  }, [subscribers, searchQuery]);

  // Handle Add Subscriber manually
  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!clean || !emailRegex.test(clean)) {
      setMsg({ text: 'Please enter a valid email address.', type: 'error' });
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
      return;
    }

    if (subscribers.some(s => s.email.toLowerCase() === clean)) {
      setMsg({ text: 'This email is already in the subscriber list.', type: 'error' });
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
      return;
    }

    setAdding(true);
    try {
      // 1. Try newsletter_subscribers
      try {
        await supabase.from('newsletter_subscribers').insert([{ email: clean }]);
      } catch (e) {}

      // 2. Insert into contact_messages
      const { data: insertedMsg, error: insertError } = await supabase.from('contact_messages').insert([{
        name: 'Newsletter Subscriber',
        email: clean,
        message: 'Subscribed to Newsletter (Added by Admin)'
      }]).select();

      // 3. Save to localStorage
      try {
        const localSaved = JSON.parse(localStorage.getItem('portfolio_newsletter_subscribers') || '[]');
        localSaved.unshift({
          id: 'sub_' + Date.now(),
          email: clean,
          created_at: new Date().toISOString(),
          source: 'Admin Panel'
        });
        localStorage.setItem('portfolio_newsletter_subscribers', JSON.stringify(localSaved));
      } catch (e) {}

      setMsg({ text: `Successfully added ${clean}!`, type: 'success' });
      setNewEmail('');
      setShowAddForm(false);
      fetchSubscribers();
    } catch (err: any) {
      setMsg({ text: `Error adding subscriber: ${err.message}`, type: 'error' });
    } finally {
      setAdding(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    }
  };

  // Delete subscriber
  const deleteSubscriber = async (subscriber: NewsletterSubscriber) => {
    if (!confirm(`Are you sure you want to remove ${subscriber.email} from the newsletter list?`)) {
      return;
    }

    try {
      // 1. Delete from contact_messages if message_id exists or by email
      if (subscriber.message_id) {
        await supabase.from('contact_messages').delete().eq('id', subscriber.message_id);
      }
      await supabase.from('contact_messages').delete().eq('email', subscriber.email);

      // 2. Delete from newsletter_subscribers if it exists
      try {
        await supabase.from('newsletter_subscribers').delete().eq('email', subscriber.email);
      } catch (e) {}

      // 3. Delete from localStorage
      try {
        const localSaved = JSON.parse(localStorage.getItem('portfolio_newsletter_subscribers') || '[]');
        const updated = localSaved.filter((item: any) => item.email?.toLowerCase() !== subscriber.email.toLowerCase());
        localStorage.setItem('portfolio_newsletter_subscribers', JSON.stringify(updated));
      } catch (e) {}

      // Optimistically remove from state
      setSubscribers(prev => prev.filter(s => s.email.toLowerCase() !== subscriber.email.toLowerCase()));
      setMsg({ text: `Removed ${subscriber.email} from subscribers.`, type: 'success' });
    } catch (err: any) {
      console.error('Error deleting subscriber:', err);
      setMsg({ text: `Error deleting: ${err.message}`, type: 'error' });
    }
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  // Copy All Emails comma-separated
  const copyAllEmails = async () => {
    if (subscribers.length === 0) return;
    const allEmails = subscribers.map(s => s.email).join(', ');
    try {
      await navigator.clipboard.writeText(allEmails);
      setCopiedAll(true);
      setMsg({ text: `Copied ${subscribers.length} emails to clipboard!`, type: 'success' });
      setTimeout(() => {
        setCopiedAll(false);
        setMsg({ text: '', type: '' });
      }, 3000);
    } catch (e) {
      setMsg({ text: 'Failed to copy emails', type: 'error' });
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  // Copy single email
  const copySingleEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (subscribers.length === 0) return;
    const headers = ['Email', 'Subscribed Date', 'Source'];
    const rows = subscribers.map(s => [
      `"${s.email}"`,
      `"${new Date(s.created_at).toLocaleString()}"`,
      `"${s.source || 'Website Footer'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `newsletter_subscribers_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setMsg({ text: 'Subscribers exported to CSV successfully!', type: 'success' });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">Newsletter Subscribers</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
              {subscribers.length} total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            People who signed up via the website footer newsletter form or added via admin.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={fetchSubscribers}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
            title="Refresh List"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={copyAllEmails}
            disabled={subscribers.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
            title="Copy all email addresses comma separated"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Copied!' : 'Copy All Emails'}</span>
          </button>

          <button
            type="button"
            onClick={exportToCSV}
            disabled={subscribers.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
            title="Download CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 cursor-pointer transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subscriber</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {msg.text && (
        <div className={`p-3 rounded-md text-sm flex items-center gap-2 ${
          msg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          {msg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Add Subscriber Form Accordion */}
      {showAddForm && (
        <form 
          onSubmit={handleAddSubscriber} 
          className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-lg space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-indigo-900">Add New Subscriber Manually</h4>
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)} 
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="subscriber@example.com"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={adding}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
            >
              {adding ? 'Adding...' : 'Add to List'}
            </button>
          </div>
        </form>
      )}

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search subscribers by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear search ({filteredSubscribers.length} found)
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="text-gray-500 text-center py-12 border border-dashed rounded-lg flex flex-col items-center gap-2">
          <div className="w-6 h-6 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <span className="text-xs">Loading newsletter subscribers...</span>
        </div>
      ) : subscribers.length === 0 ? (
        /* Empty State */
        <div className="text-center py-14 border border-dashed rounded-lg bg-gray-50/50 space-y-3">
          <Mail className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-semibold text-gray-800">No Newsletter Subscribers Yet</h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
            When visitors subscribe via the newsletter form at the bottom of the website, their emails will appear here automatically.
          </p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add a test subscriber</span>
          </button>
        </div>
      ) : (
        /* Subscribers List */
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Date Subscribed</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubscribers.map((sub, index) => (
                  <tr key={sub.id || sub.email} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 text-xs text-gray-400 text-center font-mono">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                        <a
                          href={`mailto:${sub.email}`}
                          className="font-medium text-gray-900 hover:text-indigo-600 hover:underline"
                        >
                          {sub.email}
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(sub.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        <span className="text-gray-400">
                          {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <UserCheck className="w-3 h-3" />
                        {sub.source || 'Website Footer'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => copySingleEmail(sub.email)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                          title="Copy Email"
                        >
                          {copiedEmail === sub.email ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSubscriber(sub)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete Subscriber"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubscribers.length === 0 && searchQuery && (
            <div className="p-8 text-center text-sm text-gray-500">
              No subscribers found matching "{searchQuery}".
            </div>
          )}
        </div>
      )}
    </div>
  );
}
