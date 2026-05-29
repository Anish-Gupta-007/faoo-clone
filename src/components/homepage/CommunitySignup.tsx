'use client';

import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { newsletterService } from '@/services/newsletterService';
import toast from 'react-hot-toast';
import { COMMUNITY_SIGNUP } from '@/constants/staticContent';

export function CommunitySignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

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
    <section className="relative bg-[#F9F9F7] text-[#0A0A0A] py-28 md:py-40 overflow-hidden">
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
    </section>
  );
}
