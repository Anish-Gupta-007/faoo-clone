'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { newsletterService } from '@/services/newsletterService';
import toast from 'react-hot-toast';
import { COMMUNITY_SIGNUP } from '@/constants/staticContent';

export function CommunitySignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [doorsOpen, setDoorsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDoorsOpen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await newsletterService.subscribe(email);
      toast.success('Welcome to the Faoo community!');
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={sectionRef} className="relative bg-[#F9F9F7] text-[#0A0A0A] py-28 md:py-40 overflow-hidden" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', pointerEvents: 'none' }}>

  <div style={{
    width: '50%',
    height: '100%',
    background: '#111',
    position: 'relative',
    transform: doorsOpen ? 'translateX(-100%)' : 'translateX(0)',
    transition: 'transform 1.2s cubic-bezier(0.77,0,0.175,1)',
  }}>
    <div style={{
      position: 'absolute',
      right: 18,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 6,
      height: 34,
      background: '#8a7a5a',
      borderRadius: 3,
    }} />
    <span style={{
      position: 'absolute',
      bottom: 48,
      width: '100%',
      textAlign: 'center',
      fontFamily: 'Cormorant Garamond, serif',
      fontWeight: 300,
      fontSize: 11,
      letterSpacing: 6,
      color: '#333',
      textTransform: 'uppercase',
    }}>F A O O</span>
  </div>

  <div style={{
    width: '50%',
    height: '100%',
    background: '#111',
    position: 'relative',
    transform: doorsOpen ? 'translateX(100%)' : 'translateX(0)',
    transition: 'transform 1.2s cubic-bezier(0.77,0,0.175,1)',
  }}>
    <div style={{
      position: 'absolute',
      left: 18,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 6,
      height: 34,
      background: '#8a7a5a',
      borderRadius: 3,
    }} />
    <span style={{
      position: 'absolute',
      bottom: 48,
      width: '100%',
      textAlign: 'center',
      fontFamily: 'Cormorant Garamond, serif',
      fontWeight: 300,
      fontSize: 11,
      letterSpacing: 6,
      color: '#333',
      textTransform: 'uppercase',
    }}>F A O O</span>
  </div>

  <div style={{
    position: 'absolute',
    left: '50%',
    top: 0,
    width: 1,
    height: '100%',
    background: '#2a2a2a',
    zIndex: 11,
    opacity: doorsOpen ? 0 : 1,
    transition: 'opacity 0.3s ease 0.6s',
  }} />

</div>

<div style={{
  opacity: doorsOpen ? 1 : 0,
  transform: doorsOpen ? 'translateY(0)' : 'translateY(10px)',
  transition: 'opacity 0.8s ease 0.8s, transform 0.8s ease 0.8s',
}}>
      <div className="container-page px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Subtitle Tagline */}
          <span className="text-[#0A0A0A]/40 tracking-[0.3em] font-sans font-bold text-[10px] md:text-xs uppercase mb-5 block">
            Collaborative Space
          </span>

          {/* Premium Typography Heading */}
          <h2 className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-[#0A0A0A] mb-6 tracking-tight leading-tight">
            {COMMUNITY_SIGNUP.heading}
          </h2>

          {/* Description */}
          <p className="text-neutral-500 text-sm md:text-base leading-relaxed mb-10 max-w-lg mx-auto font-sans font-light">
            {COMMUNITY_SIGNUP.subheading}
          </p>

          {/* Sleek Minimalist Form */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-5 py-4 bg-white border border-neutral-200 rounded-[2px] text-[#0A0A0A] text-sm placeholder:text-neutral-400 font-sans focus:outline-none focus:border-neutral-400 transition-all duration-300"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-[#0A0A0A] text-white rounded-[2px] font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#262626] active:scale-[0.98] transition-all duration-300 whitespace-nowrap"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <>
                    <span>Join Us</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Privacy Promise */}
            <p className="text-[9px] md:text-[10px] text-neutral-400 font-sans font-light tracking-[0.15em] uppercase mt-5">
              No spam · Unsubscribe anytime
            </p>
          </div>
        </div>
      </div>
</div>
    </section>
  );
}
