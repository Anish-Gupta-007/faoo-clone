'use client';
// src/components/plp/SortDropdown.tsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Clock, ArrowUpWideNarrow, ArrowDownWideNarrow } from 'lucide-react';
import { SORT_OPTIONS } from '@/constants/sizes';
import { cn } from '@/lib/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SortDropdown({ value, onChange, className }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = SORT_OPTIONS.find(opt => opt.value === value) || SORT_OPTIONS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (val: string) => {
    switch (val) {
      case 'newest': return <Clock size={14} />;
      case 'price_asc': return <ArrowUpWideNarrow size={14} />;
      case 'price_desc': return <ArrowDownWideNarrow size={14} />;
      default: return null;
    }
  };

  return (
    <div className={cn("relative w-48 sm:w-52 lg:w-64", className)} ref={dropdownRef}>
      {/* Main Select Box */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full h-10 lg:h-12 px-4 lg:px-6 bg-white border border-[#151515]/10 rounded-full transition-all duration-500 group",
          "hover:border-[#151515]/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
          isOpen ? "border-[#151515] bg-[#F5F4F1]/50" : "shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
        )}
      >
        <div className="flex items-center gap-2 lg:gap-3 min-w-0">
          <span className={cn(
            "text-[#151515]/40 transition-colors duration-300",
            isOpen && "text-[#151515]"
          )}>
            {getIcon(selectedOption.value)}
          </span>
          <span className="text-[12px] lg:text-[13px] font-sans font-bold text-[#151515] tracking-wide truncate">
            {selectedOption.label.replace('Price: ', '')}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={cn(
            "text-[#151515]/30 transition-transform duration-500 ease-in-out flex-shrink-0",
            isOpen ? "rotate-180 text-[#151515]" : "group-hover:text-[#151515]"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="absolute z-50 w-full sm:min-w-[220px] right-0 mt-2 bg-white/95 backdrop-blur-xl border border-[#151515]/5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden"
          >
            <div className="p-2 space-y-1">
              {SORT_OPTIONS.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-3 text-sm transition-all duration-300 rounded-xl group",
                      isSelected
                        ? "bg-gradient-to-br from-[#151515] to-[#2A2A2A] text-white shadow-lg ring-1 ring-[#D4AF37]/30"
                        : "text-[#525252] hover:bg-[#F5F4F1] hover:text-[#151515]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "transition-colors duration-300",
                        isSelected ? "text-[#D4AF37]" : "text-[#151515]/20 group-hover:text-[#151515]/40"
                      )}>
                        {getIcon(opt.value)}
                      </span>
                      <span className={cn(
                        "font-sans tracking-wide",
                        isSelected ? "font-bold" : "font-medium"
                      )}>
                        {opt.label}
                      </span>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-[#D4AF37]/10 flex items-center justify-center"
                      >
                        <Check size={12} className="text-[#D4AF37]" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
