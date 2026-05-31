'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Mail, ArrowRight, Scissors, Ruler, Sparkles, RotateCw } from 'lucide-react';
import { WE_CUSTOMISE } from '@/constants/staticContent';

const ease = [0.25, 1, 0.5, 1] as const;

// Customizer Fabric colors
const COLORS = [
  { name: 'Onyx', hex: '#1C1C1C', detail: 'Matte Twill Weave' },
  { name: 'Camel', hex: '#B89C72', detail: 'Brushed Heavy Cotton' },
  { name: 'Sage', hex: '#8FA382', detail: 'Raw Linen Blend' },
  { name: 'Crimson', hex: '#8B0026', detail: 'Structured Denim' },
  { name: 'Alabaster', hex: '#EAE6DF', detail: 'Organic Cotton' }
];

// Customizer fits
const FITS = [
  { name: 'Tailored', scaleX: 0.86, scaleY: 0.94, chest: '96 cm', length: '68 cm' },
  { name: 'Classic', scaleX: 1.0, scaleY: 1.0, chest: '104 cm', length: '72 cm' },
  { name: 'Oversized', scaleX: 1.15, scaleY: 1.04, chest: '116 cm', length: '76 cm' }
];

export function WeCustomise() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = React.useRef(false);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        forceUpdate((x) => x + 1);
      },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Customizer state
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedFit, setSelectedFit] = useState(1);
  const [sleeveLength, setSleeveLength] = useState<'short' | 'long'>('short');

  // 360 Rotation state (degrees)
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Track drag movements to rotate garment
  const dragX = useMotionValue(0);
  const lastRotation = useRef(0);

  const handleDragStart = () => {
    setIsDragging(true);
    lastRotation.current = rotation;
  };

  const handleDrag = () => {
    const currentDragX = dragX.get();
    // Convert drag pixel delta to degrees (e.g., 1px = 1.2 degrees)
    const deltaRotation = currentDragX * 1.2;
    let newRotation = (lastRotation.current + deltaRotation) % 360;
    if (newRotation < 0) newRotation += 360;
    setRotation(newRotation);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    dragX.set(0);
  };

  // Determine if we show front or back view based on rotation angle
  // Front: 0 to 90 degrees AND 270 to 360 degrees
  // Back: 90 to 270 degrees
  const isBackView = rotation > 90 && rotation < 270;

  // Calculate dynamic 3D lighting opacity based on rotation (darker on sides)
  const getSideShadowOpacity = () => {
    const rad = (rotation * Math.PI) / 180;
    return Math.abs(Math.sin(rad)) * 0.4;
  };

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#FAF9F5] border-y border-[#EAE6DF]"
      style={{ padding: '80px 0' }}
    >
      {/* Background grid line accents */}
      <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden>
        <div className="absolute top-0 bottom-0 left-[25%] w-px bg-dashed border-l border-neutral-300/40" />
        <div className="absolute top-0 bottom-0 left-[75%] w-px bg-dashed border-l border-neutral-300/40" />
      </div>

      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* LEFT COLUMN: Copywriting */}
          <div className="lg:col-span-5 flex flex-col gap-6 items-center lg:items-start">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={inView.current ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, ease }}
              className="flex items-center gap-3 justify-center lg:justify-start"
            >
              <div className="w-8 h-px bg-[#c9a84c]" />
              <span className="text-[9px] font-sans font-bold tracking-[0.4em] uppercase text-[#1a1a1a]/60">
                {WE_CUSTOMISE.subheading ?? 'Bespoke Service'}
              </span>
              <div className="w-8 h-px bg-[#c9a84c]" />
            </motion.div>

            <div className="overflow-hidden w-full text-center lg:text-left">
              <motion.h2
                initial={{ y: '100%' }}
                animate={inView.current ? { y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1, ease }}
                className="font-display font-black text-[#1a1a1a] leading-[1.0] tracking-tight"
                style={{ fontSize: 'clamp(38px, 5.5vw, 68px)' }}
              >
                {WE_CUSTOMISE.heading}
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView.current ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25, ease }}
              className="font-sans text-sm md:text-[15px] text-[#1a1a1a]/60 leading-[1.8] font-light text-center lg:text-left"
            >
              {WE_CUSTOMISE.description}
            </motion.p>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView.current ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35, ease }}
              className="pt-2 flex justify-center lg:justify-start w-full"
            >
              <a
                href={WE_CUSTOMISE.emailHref}
                className="group relative inline-flex items-center gap-3 bg-[#1a1a1a] text-white px-8 py-4 rounded-full font-sans text-[10px] font-bold tracking-[0.25em] uppercase overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-[#c9a84c] translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative z-10 flex items-center gap-2.5 group-hover:text-[#1a1a1a] transition-colors duration-300">
                  <Mail size={13} />
                  {WE_CUSTOMISE.ctaText ?? 'Start Custom Order'}
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </a>
            </motion.div>

            {/* Quick stats indicators */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView.current ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45, ease }}
              className="flex items-center gap-6 pt-6 border-t border-[#1a1a1a]/10 mt-2 justify-center lg:justify-start flex-wrap"
            >
              {[{ v: '100%', l: 'Handcrafted' }, { v: 'Bespoke', l: 'Sizing' }, { v: '24hr', l: 'Response' }].map((s, i) => (
                <React.Fragment key={s.l}>
                  {i > 0 && <div className="w-px h-6 bg-[#1a1a1a]/12" />}
                  <div className="flex flex-col gap-0.5">
                    <span className="font-display font-bold text-sm text-[#1a1a1a] leading-none">{s.v}</span>
                    <span className="font-sans text-[8px] tracking-[0.2em] uppercase text-[#1a1a1a]/40">{s.l}</span>
                  </div>
                </React.Fragment>
              ))}
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Realistic 3D Rotatable Customizer */}
          <div className="lg:col-span-7 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView.current ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="w-full max-w-[500px] bg-white border border-[#EAE6DF] rounded-2xl p-6 md:p-8 shadow-[0_24px_50px_rgba(0,0,0,0.04)] relative overflow-hidden"
            >
              {/* Studio Grid Accent behind the garment */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

              {/* Top Customizer Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Scissors size={14} className="text-[#c9a84c]" />
                  <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#1a1a1a]/80 font-bold">FAOO 3D Customizer</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#FAF9F5] px-2 py-1 rounded border border-neutral-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-[7px] text-neutral-500 uppercase tracking-wider">3D Interactive</span>
                </div>
              </div>

              {/* 3D Garment Preview Canvas */}
              <div
                className="relative h-[250px] bg-[#FAF9F5] rounded-xl flex flex-col items-center justify-center overflow-hidden border border-neutral-100 shadow-inner cursor-grab active:cursor-grabbing select-none"
                style={{ perspective: '800px' }}
              >
                {/* Drag interaction overlay */}
                <motion.div
                  drag="x"
                  dragElastic={0}
                  dragMomentum={false}
                  style={{ x: dragX }}
                  onDragStart={handleDragStart}
                  onDrag={handleDrag}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-0 z-30"
                />

                {/* Drag to Spin Prompt */}
                <div className="absolute top-3 left-4 flex items-center gap-1.5 text-neutral-400 pointer-events-none z-20">
                  <RotateCw size={10} className="animate-spin duration-1000" style={{ animationDuration: '3s' }} />
                  <span className="font-sans text-[7px] tracking-[0.2em] uppercase">Drag horizontally to rotate 360°</span>
                </div>

                {/* 3D Rotatable Garment Wrapper */}
                <motion.div
                  className="w-[200px] h-[200px] flex items-center justify-center relative z-10"
                  animate={{
                    rotateY: rotation,
                    scaleX: FITS[selectedFit].scaleX,
                    scaleY: FITS[selectedFit].scaleY
                  }}
                  transition={isDragging ? { type: 'just' } : { type: 'spring', stiffness: 100, damping: 14 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)]">
                    <defs>
                      {/* Fabric Texture Pattern */}
                      <pattern id="fabric-weave-3d" width="4" height="4" patternUnits="userSpaceOnUse">
                        <path d="M 0 4 L 4 0 M 0 0 L 4 4" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        <path d="M 2 0 L 2 4 M 0 2 L 4 2" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
                      </pattern>

                      {/* Volumetric Shading */}
                      <radialGradient id="body-highlight-3d" cx="50%" cy="40%" r="50%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
                      </radialGradient>

                      {/* Inside neck shadow */}
                      <radialGradient id="inner-neck-glow-3d" cx="50%" cy="30%" r="40%">
                        <stop offset="0%" stopColor="rgba(0,0,0,0.5)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
                      </radialGradient>
                    </defs>

                    {/* FRONT VIEW OF SHIRT */}
                    {!isBackView ? (
                      <g id="front-view">
                        {/* Hanger (Behind Front Collar) */}
                        <path d="M 150 48 Q 155 35 162 38 T 152 56" fill="none" stroke="#A3A3A3" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 115 65 Q 150 50 185 65 L 187 69 Q 150 54 113 69 Z" fill="#8C765C" stroke="#705C46" strokeWidth="0.5" />

                        {/* Inside back collar area (visible in neck opening) */}
                        <path
                          d="M 116 66 C 116 54, 184 54, 184 66 C 184 76, 116 76, 116 66 Z"
                          fill={COLORS[selectedColor].hex}
                          className="transition-colors duration-500 brightness-75"
                        />
                        <path d="M 116 66 C 116 54, 184 54, 184 66 Z" fill="url(#inner-neck-glow-3d)" className="opacity-60" />

                        {/* Stitched brand label inside neck */}
                        <rect x="134" y="60" width="32" height="12" fill="#EAE6DF" rx="1" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                        <text x="150" y="68" fill="#1C1C1C" fontSize="5" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1" fontWeight="bold">FAOO</text>

                        {/* Main Garment Front Body Shape */}
                        <motion.path
                          d={sleeveLength === 'short'
                            ? "M 115 65 C 130 68, 170 68, 185 65 C 205 69, 222 75, 235 85 L 245 110 C 235 115, 225 116, 218 110 L 214 96 C 214 120, 218 190, 215 240 C 180 245, 120 245, 85 240 C 82 190, 86 120, 86 96 L 82 110 C 75 116, 65 115, 55 110 L 65 85 C 78 75, 95 69, 115 65 Z"
                            : "M 115 65 C 130 68, 170 68, 185 65 C 205 69, 222 75, 235 85 L 255 155 C 248 160, 240 160, 235 154 L 216 98 C 216 120, 218 190, 215 240 C 180 245, 120 245, 85 240 C 82 190, 84 120, 84 98 L 65 154 C 60 160, 52 160, 45 155 L 65 85 C 78 75, 95 69, 115 65 Z"
                          }
                          fill={COLORS[selectedColor].hex}
                          className="transition-colors duration-500"
                        />

                        {/* Texture Weave Overlay */}
                        <motion.path
                          d={sleeveLength === 'short'
                            ? "M 115 65 C 130 68, 170 68, 185 65 C 205 69, 222 75, 235 85 L 245 110 C 235 115, 225 116, 218 110 L 214 96 C 214 120, 218 190, 215 240 C 180 245, 120 245, 85 240 C 82 190, 86 120, 86 96 L 82 110 C 75 116, 65 115, 55 110 L 65 85 C 78 75, 95 69, 115 65 Z"
                            : "M 115 65 C 130 68, 170 68, 185 65 C 205 69, 222 75, 235 85 L 255 155 C 248 160, 240 160, 235 154 L 216 98 C 216 120, 218 190, 215 240 C 180 245, 120 245, 85 240 C 82 190, 84 120, 84 98 L 65 154 C 60 160, 52 160, 45 155 L 65 85 C 78 75, 95 69, 115 65 Z"
                          }
                          fill="url(#fabric-weave-3d)"
                        />

                        {/* Volumetric Shading */}
                        <motion.path
                          d={sleeveLength === 'short'
                            ? "M 115 65 C 130 68, 170 68, 185 65 C 205 69, 222 75, 235 85 L 245 110 C 235 115, 225 116, 218 110 L 214 96 C 214 120, 218 190, 215 240 C 180 245, 120 245, 85 240 C 82 190, 86 120, 86 96 L 82 110 C 75 116, 65 115, 55 110 L 65 85 C 78 75, 95 69, 115 65 Z"
                            : "M 115 65 C 130 68, 170 68, 185 65 C 205 69, 222 75, 235 85 L 255 155 C 248 160, 240 160, 235 154 L 216 98 C 216 120, 218 190, 215 240 C 180 245, 120 245, 85 240 C 82 190, 84 120, 84 98 L 65 154 C 60 160, 52 160, 45 155 L 65 85 C 78 75, 95 69, 115 65 Z"
                          }
                          fill="url(#body-highlight-3d)"
                          className="mix-blend-overlay"
                        />

                        {/* Armpit fold lines */}
                        <path d="M 86 100 Q 95 110 100 125" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M 214 100 Q 205 110 200 125" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="1.5" strokeLinecap="round" />

                        {/* Natural curved body fold shadows */}
                        <path d="M 125 90 C 122 130, 118 180, 125 235" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 175 90 C 178 130, 182 180, 175 235" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="2" strokeLinecap="round" />

                        {/* Stitch lines on shoulders */}
                        <path d="M 115 67 C 105 73, 90 77, 83 83" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 2" />
                        <path d="M 185 67 C 195 73, 210 77, 217 83" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 2" />

                        {/* Ribbed front collar ring */}
                        <path d="M 115 65 C 115 76, 185 76, 185 65" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2.5" />
                        <path d="M 115 65 C 115 76, 185 76, 185 65" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="1 1" />
                      </g>
                    ) : (
                      // BACK VIEW OF SHIRT (Hanger Hook reverses, collar rises, back yoke seam is shown)
                      <g id="back-view">
                        {/* Reversed Hanger hook */}
                        <path d="M 150 48 Q 145 35 138 38 T 148 56" fill="none" stroke="#A3A3A3" strokeWidth="2.5" strokeLinecap="round" />

                        {/* Main Garment Back Body Shape (higher neckline) */}
                        <motion.path
                          d={sleeveLength === 'short'
                            ? "M 115 63 C 130 64, 170 64, 185 63 C 205 67, 222 75, 235 85 L 245 110 C 235 115, 225 116, 218 110 L 214 96 C 214 120, 218 190, 215 240 C 180 245, 120 245, 85 240 C 82 190, 86 120, 86 96 L 82 110 C 75 116, 65 115, 55 110 L 65 85 C 78 75, 95 69, 115 63 Z"
                            : "M 115 63 C 130 64, 170 64, 185 63 C 205 67, 222 75, 235 85 L 255 155 C 248 160, 240 160, 235 154 L 216 98 C 216 120, 218 190, 215 240 C 180 245, 120 245, 85 240 C 82 190, 84 120, 84 98 L 65 154 C 60 160, 52 160, 45 155 L 65 85 C 78 75, 95 69, 115 63 Z"
                          }
                          fill={COLORS[selectedColor].hex}
                          className="transition-colors duration-500"
                        />

                        {/* Texture Weave Overlay */}
                        <motion.path
                          d={sleeveLength === 'short'
                            ? "M 115 63 C 130 64, 170 64, 185 63 C 205 67, 222 75, 235 85 L 245 110 C 235 115, 225 116, 218 110 L 214 96 C 214 120, 218 190, 215 240 C 180 245, 120 245, 85 240 C 82 190, 86 120, 86 96 L 82 110 C 75 116, 65 115, 55 110 L 65 85 C 78 75, 95 69, 115 63 Z"
                            : "M 115 63 C 130 64, 170 64, 185 63 C 205 67, 222 75, 235 85 L 255 155 C 248 160, 240 160, 235 154 L 216 98 C 216 120, 218 190, 215 240 C 180 245, 120 245, 85 240 C 82 190, 84 120, 84 98 L 65 154 C 60 160, 52 160, 45 155 L 65 85 C 78 75, 95 69, 115 63 Z"
                          }
                          fill="url(#fabric-weave-3d)"
                        />

                        {/* Volumetric Shading */}
                        <motion.path
                          d={sleeveLength === 'short'
                            ? "M 115 63 C 130 64, 170 64, 185 63 C 205 67, 222 75, 235 85 L 245 110 C 235 115, 225 116, 218 110 L 214 96 C 214 120, 218 190, 215 240 C 180 245, 120 245, 85 240 C 82 190, 86 120, 86 96 L 82 110 C 75 116, 65 115, 55 110 L 65 85 C 78 75, 95 69, 115 63 Z"
                            : "M 115 63 C 130 64, 170 64, 185 63 C 205 67, 222 75, 235 85 L 255 155 C 248 160, 240 160, 235 154 L 216 98 C 216 120, 218 190, 215 240 C 180 245, 120 245, 85 240 C 82 190, 84 120, 84 98 L 65 154 C 60 160, 52 160, 45 155 L 65 85 C 78 75, 95 69, 115 63 Z"
                          }
                          fill="url(#body-highlight-3d)"
                          className="mix-blend-overlay"
                        />

                        {/* High Back Collar Band */}
                        <path d="M 115 63 C 115 67, 185 67, 185 63" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="3" />

                        {/* Back Yoke Stitching Seam across shoulders (very premium detail) */}
                        <path d="M 85 92 Q 150 96 215 92" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.2" strokeDasharray="3 2" />

                        {/* Back vertical drape lines */}
                        <path d="M 150 96 L 150 240" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" strokeDasharray="4 3" />
                      </g>
                    )}

                    {/* 3D Edge Shading overlays that darken the garment when turned sideways */}
                    <rect
                      x="30" y="50" width="240" height="200"
                      fill="url(#body-highlight-3d)"
                      className="pointer-events-none"
                      style={{ opacity: getSideShadowOpacity(), mixBlendMode: 'multiply' }}
                    />
                  </svg>
                </motion.div>

                {/* 3D Rotate indicator badge */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between border-t border-dashed border-[#c9a84c]/50 pt-2 font-mono text-[8px] text-[#1a1a1a]/60">
                  <div className="flex items-center gap-1">
                    <Ruler size={10} className="text-[#c9a84c]" />
                    <span>Chest: {FITS[selectedFit].chest}</span>
                  </div>
                  <span>Rotation: {Math.round(rotation)}°</span>
                </div>
              </div>

              {/* Customizer Slider Control */}
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[8px] font-sans font-bold tracking-[0.2em] uppercase text-[#1a1a1a]/40">
                  <span>3D Rotate View</span>
                  <span>{Math.round(rotation)}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#c9a84c] focus:outline-none"
                />
              </div>

              {/* Customizer Controls Panel */}
              <div className="mt-5 flex flex-col gap-4">

                {/* 1. Fabric Color Selection */}
                <div className="flex flex-col gap-1.5">
                  <span className="font-sans text-[8px] tracking-[0.2em] uppercase text-[#1a1a1a]/40 font-bold">1. Select Fabric Colour</span>
                  <div className="flex gap-3">
                    {COLORS.map((c, i) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(i)}
                        className="group relative flex items-center justify-center w-8 h-8 rounded-full border border-neutral-200 hover:scale-105 active:scale-95 transition-all duration-300"
                        title={`${c.name} (${c.detail})`}
                      >
                        <span
                          className="w-6 h-6 rounded-full block relative overflow-hidden"
                          style={{ background: c.hex }}
                        />
                        {selectedColor === i && (
                          <motion.div
                            layoutId="activeColorBorder"
                            className="absolute -inset-0.5 rounded-full border-2 border-[#c9a84c] pointer-events-none"
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Fit selection */}
                <div className="flex flex-col gap-1.5">
                  <span className="font-sans text-[8px] tracking-[0.2em] uppercase text-[#1a1a1a]/40 font-bold">2. Choose Silhouette Fit</span>
                  <div className="grid grid-cols-3 gap-2">
                    {FITS.map((fit, i) => (
                      <button
                        key={fit.name}
                        onClick={() => setSelectedFit(i)}
                        className={`py-2 px-3 rounded-lg border text-center text-[9px] font-sans font-bold tracking-[0.15em] uppercase transition-all duration-300 ${selectedFit === i
                            ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                            : 'bg-[#FAF9F5] text-[#1a1a1a]/60 border-neutral-200 hover:border-neutral-400'
                          }`}
                      >
                        {fit.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Sleeve toggle */}
                <div className="flex flex-col gap-1.5">
                  <span className="font-sans text-[8px] tracking-[0.2em] uppercase text-[#1a1a1a]/40 font-bold">3. Sleeve Length Style</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['short', 'long'] as const).map((len) => (
                      <button
                        key={len}
                        onClick={() => setSleeveLength(len)}
                        className={`py-2 px-3 rounded-lg border text-center text-[9px] font-sans font-bold tracking-[0.15em] uppercase transition-all duration-300 ${sleeveLength === len
                            ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                            : 'bg-[#FAF9F5] text-[#1a1a1a]/60 border-neutral-200 hover:border-neutral-400'
                          }`}
                      >
                        {len} Sleeve
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sub-text indicating that it is hand-cut */}
              <div className="mt-5 border-t border-neutral-100 pt-4 flex items-center justify-between text-[#1a1a1a]/45">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={10} className="text-[#c9a84c]" />
                  <span className="font-sans text-[7px] tracking-[0.2em] uppercase">{COLORS[selectedColor].detail}</span>
                </div>
                <span className="font-sans text-[7px] tracking-[0.2em] uppercase font-bold">1-of-1 Piece</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
