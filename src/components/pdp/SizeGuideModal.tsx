'use client';
// src/components/pdp/SizeGuideModal.tsx
import { Modal } from '@/components/ui/Modal';
import { SIZE_GUIDE_TABLE } from '@/constants/sizes';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Size Guide" size="md">
      <div className="px-6 pb-6">
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
      </div>
    </Modal>
  );
}
