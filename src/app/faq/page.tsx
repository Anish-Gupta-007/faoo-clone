'use client';
// src/app/faq/page.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ_ITEMS } from '@/constants/staticContent';
import { cn } from '@/lib/cn';

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="container-page py-16 max-w-2xl">
      <h1 className="font-display text-5xl text-[#0A0A0A] mb-10">FAQ</h1>
      <div className="flex flex-col divide-y divide-[#EFEFEF]">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex items-center justify-between w-full py-5 text-left"
              aria-expanded={open === i}
            >
              <span className="font-sans text-sm font-medium text-[#0A0A0A] pr-4">{item.question}</span>
              <ChevronDown size={16} className={cn('flex-shrink-0 text-[#A3A3A3] transition-transform', open === i && 'rotate-180')} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <p className="font-sans text-sm text-[#525252] pb-5 leading-relaxed">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
