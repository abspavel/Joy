import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FadeIn } from '../components/FadeIn';
import { FooterSection } from '../sections/FooterSection';
import { Magnet } from '../components/Magnet';
import { Mail, Phone, MapPin, Github, Linkedin, Instagram, Twitter, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
    
    setLoading(true);
    setStatus({ type: '', text: '' });
    
    const { error } = await supabase.from('contact_messages').insert([{
      name: formData.name,
      email: formData.email,
      message: formData.message
    }]);

    setLoading(false);
    
    if (error) {
      setStatus({ type: 'error', text: 'Failed to send message. Please try again later.' });
    } else {
      setStatus({ type: 'success', text: 'Message sent successfully! I will get back to you soon.' });
      setFormData({ name: '', email: '', message: '' });
    }
    
    setTimeout(() => setStatus({ type: '', text: '' }), 5000);
  };

  return (
    <main className="bg-[#0C0C0C] min-h-screen flex flex-col font-sans selection:bg-[#BBCCD7] selection:text-[#0C0C0C]">
      {/* Navbar Reused */}
      <FadeIn delay={0} y={-20} as="nav" className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8 relative z-40">
        <Link to="/" className="text-xl md:text-2xl font-bold tracking-tighter text-[#D7E2EA]">JOY</Link>
        <div className="flex gap-4 sm:gap-8 md:gap-12 items-center">
          {['About', 'Projects'].map((item) => (
            <a
              key={item}
              href={`/#${item.toLowerCase()}`}
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-xs sm:text-sm md:text-lg lg:text-[1.2rem] hover:opacity-70 transition-opacity duration-200"
            >
              {item}
            </a>
          ))}
          <Link
            to="/contact"
            className="text-[#D7E2EA] font-bold uppercase tracking-wider text-xs sm:text-sm md:text-lg lg:text-[1.2rem] hover:opacity-70 transition-opacity duration-200"
          >
            CONTACT
          </Link>
        </div>
      </FadeIn>

      <div className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-20">
        <FadeIn delay={0.1} y={30}>
          <h1 className="hero-heading font-black uppercase text-[clamp(3rem,12vw,140px)] leading-none tracking-tighter mb-4">
            LET'S TALK
          </h1>
        </FadeIn>
        <FadeIn delay={0.2} y={20}>
          <p className="text-[#D7E2EA] font-light text-lg md:text-2xl max-w-2xl mb-16 md:mb-24">
            Have a project in mind? I'd love to hear about it.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Info */}
          <div className="space-y-10">
            <FadeIn delay={0.3} y={20} className="space-y-6">
              <a href="mailto:abspavel126@gmail.com" className="flex items-center gap-4 text-[#D7E2EA] hover:opacity-70 transition-opacity group">
                <div className="w-12 h-12 rounded-full border border-[#D7E2EA]/20 flex items-center justify-center group-hover:border-[#D7E2EA]/50 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-lg md:text-xl font-light tracking-wide">abspavel126@gmail.com</div>
              </a>
              <a href="tel:+8801835985730" className="flex items-center gap-4 text-[#D7E2EA] hover:opacity-70 transition-opacity group">
                <div className="w-12 h-12 rounded-full border border-[#D7E2EA]/20 flex items-center justify-center group-hover:border-[#D7E2EA]/50 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-lg md:text-xl font-light tracking-wide">+880 1835 985730</div>
              </a>
              <div className="flex items-center gap-4 text-[#D7E2EA]">
                <div className="w-12 h-12 rounded-full border border-[#D7E2EA]/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-lg md:text-xl font-light tracking-wide">Dhaka, Bangladesh</div>
              </div>
            </FadeIn>

            <FadeIn delay={0.4} y={20}>
              <div className="pt-8 border-t border-[#D7E2EA]/10 flex gap-4">
                <Magnet padding={40} strength={1}>
                  <a href="#" className="w-12 h-12 rounded-full bg-[#141414] border border-[#D7E2EA]/10 flex items-center justify-center text-[#D7E2EA] hover:bg-[#D7E2EA] hover:text-[#0C0C0C] transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                </Magnet>
                <Magnet padding={40} strength={1}>
                  <a href="#" className="w-12 h-12 rounded-full bg-[#141414] border border-[#D7E2EA]/10 flex items-center justify-center text-[#D7E2EA] hover:bg-[#D7E2EA] hover:text-[#0C0C0C] transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </Magnet>
                <Magnet padding={40} strength={1}>
                  <a href="#" className="w-12 h-12 rounded-full bg-[#141414] border border-[#D7E2EA]/10 flex items-center justify-center text-[#D7E2EA] hover:bg-[#D7E2EA] hover:text-[#0C0C0C] transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                </Magnet>
                <Magnet padding={40} strength={1}>
                  <a href="#" className="w-12 h-12 rounded-full bg-[#141414] border border-[#D7E2EA]/10 flex items-center justify-center text-[#D7E2EA] hover:bg-[#D7E2EA] hover:text-[#0C0C0C] transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                </Magnet>
              </div>
            </FadeIn>
          </div>

          {/* Contact Form */}
          <FadeIn delay={0.5} y={30}>
            <form onSubmit={handleSubmit} className="bg-[#141414] p-8 md:p-10 rounded-2xl border border-[#D7E2EA]/10 space-y-6">
              {status.text && (
                <div className={`p-4 rounded-lg text-sm border ${status.type === 'error' ? 'bg-red-950/30 border-red-900/50 text-red-200' : 'bg-green-950/30 border-green-900/50 text-green-200'}`}>
                  {status.text}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-[#D7E2EA]/60 text-sm uppercase tracking-wider">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-[#0C0C0C] border border-[#D7E2EA]/20 rounded-lg p-4 text-[#D7E2EA] focus:outline-none focus:border-[#B600A8] transition-colors"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#D7E2EA]/60 text-sm uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-[#0C0C0C] border border-[#D7E2EA]/20 rounded-lg p-4 text-[#D7E2EA] focus:outline-none focus:border-[#B600A8] transition-colors"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#D7E2EA]/60 text-sm uppercase tracking-wider">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-[#0C0C0C] border border-[#D7E2EA]/20 rounded-lg p-4 text-[#D7E2EA] focus:outline-none focus:border-[#B600A8] transition-colors resize-none"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full px-8 py-4 text-sm md:text-base text-white font-medium uppercase tracking-widest relative overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center gap-2 mt-4"
                style={{
                  background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                  boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
                  outline: '2px solid white',
                  outlineOffset: '-3px'
                }}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Message'}
              </button>
            </form>
          </FadeIn>
        </div>
      </div>

      <FooterSection />
    </main>
  );
}
