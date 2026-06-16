'use client';
// src/components/pdp/SizeGuideModal.tsx
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { SIZE_GUIDE_TABLE } from '@/constants/sizes';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  sizeChartUrl?: string | null;
  sizeChart2Url?: string | null;
}

export function SizeGuideModal({ isOpen, onClose, sizeChartUrl, sizeChart2Url }: SizeGuideModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Collect available chart URLs
  const charts = [sizeChartUrl, sizeChart2Url].filter(Boolean) as string[];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? charts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === charts.length - 1 ? 0 : prev + 1));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Size Guide" size="md">
      <div className="px-6 pb-6">
        {charts.length > 0 ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-xs font-sans text-[#737373] tracking-widest uppercase text-center mb-1">
              Custom Size Measurements
            </p>
            <div className="relative w-full overflow-hidden bg-white border border-[#EFEFEF] rounded-lg shadow-sm flex flex-col items-center justify-center p-2">
              <div className="relative w-full flex items-center justify-center">
                {charts.length > 1 && (
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 z-10 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-md border border-[#EFEFEF] text-[#151515] transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                
                <img
                  src={charts[currentIndex]}
                  alt={`Size Chart ${currentIndex + 1}`}
                  className="max-w-full h-auto object-contain max-h-[70vh] rounded-md transition-opacity duration-300"
                />

                {charts.length > 1 && (
                  <button
                    onClick={handleNext}
                    className="absolute right-2 z-10 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-md border border-[#EFEFEF] text-[#151515] transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>

              {charts.length > 1 && (
                <div className="flex justify-center gap-2 mt-4 mb-2">
                  {charts.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentIndex === idx ? 'bg-[#151515] w-5' : 'bg-[#151515]/20 w-1.5 hover:bg-[#151515]/40'
                      }`}
                      aria-label={`Go to size chart ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm font-sans text-[#525252] mb-4">
              All measurements are in inches. For the best fit, measure yourself and compare with the chart below.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-[#EFEFEF]">
                    {['Size', 'Chest', 'Waist', 'Hip', 'Length'].map((h) => (
                      <th key={h} className="text-left py-2.5 pr-4 text-xs font-medium tracking-widest uppercase text-[#A3A3A3]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SIZE_GUIDE_TABLE.map((row, i) => (
                    <tr key={row.size} className={i % 2 === 0 ? 'bg-[#F9F9F7]' : ''}>
                      <td className="py-2.5 pr-4 font-medium text-[#0A0A0A]">{row.size}</td>
                      <td className="py-2.5 pr-4 text-[#525252]">{row.chest}</td>
                      <td className="py-2.5 pr-4 text-[#525252]">{row.waist}</td>
                      <td className="py-2.5 pr-4 text-[#525252]">{row.hip}</td>
                      <td className="py-2.5 text-[#525252]">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
