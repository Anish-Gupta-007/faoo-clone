'use client';
// src/components/popup/FirstUserPopup.tsx
import { useState, useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { storage } from '@/utils/storage';
import { newsletterService } from '@/services/newsletterService';
import toast from 'react-hot-toast';
import { POPUP_CONTENT } from '@/constants/staticContent';

export function FirstUserPopup() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const started = useRef(false);

  const { user, isAuthenticated } = useAuthStore();
  const { markPopupSeen } = useUIStore();

  const shouldShow = () => {
    if (storage.isPopupSeen()) return false;
    if (isAuthenticated && user && !user.isFirstOrder) return false;
    return true;
  };

  useEffect(() => {
    if (!shouldShow()) return;

    const handleScroll = () => {
      if (started.current) return;
      started.current = true;
      scrollTimer.current = setTimeout(() => setVisible(true), 5000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [isAuthenticated, user]);

  const handleClose = () => {
    setVisible(false);
    markPopupSeen();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(POPUP_CONTENT.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await newsletterService.subscribe(email);
      toast.success('You\'re in! Check your email.');
      handleClose();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <Modal isOpen={visible} onClose={handleClose} size="sm">
      <div className="px-8 py-8 flex flex-col items-center text-center gap-5">
        {/* Welcome */}
        <div>
          <h2 className="font-display text-4xl text-[#0A0A0A]">{POPUP_CONTENT.heading}</h2>
          <p className="text-sm font-sans text-[#525252] mt-2">{POPUP_CONTENT.subheading}</p>
        </div>

        {/* Discount text */}
        <p className="text-sm font-sans font-medium text-[#0A0A0A]">{POPUP_CONTENT.discountText}</p>

        {/* Coupon chip */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-3 bg-[#0A0A0A] text-white px-5 py-3 rounded-md font-mono text-base tracking-widest hover:bg-[#262626] transition-colors"
          aria-label="Copy coupon code"
        >
          {POPUP_CONTENT.couponCode}
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Check size={16} />
              </motion.span>
            ) : (
              <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Copy size={16} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Email subscribe (only for non-logged-in) */}
        {!isAuthenticated && (
          <form onSubmit={handleSubscribe} className="w-full flex flex-col gap-3">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <Button type="submit" variant="secondary" fullWidth loading={subscribing}>
              Subscribe & Save
            </Button>
          </form>
        )}

        <button onClick={handleClose} className="text-xs font-sans text-[#A3A3A3] hover:text-[#525252] transition-colors">
          No thanks, I'll pay full price
        </button>
      </div>
    </Modal>
  );
}
