'use client';

import { useEffect, useRef } from 'react';

export function Coin3D() {
  const coinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    let angle = 0;
    const tick = () => {
      angle += 0.8; // Smooth premium rotation speed
      if (coinRef.current) {
        coinRef.current.style.transform = `rotateY(${angle}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const size = 120; // 120px fits the grid column perfectly without overflowing or causing layout shifts

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{
        width: size,
        height: size,
        perspective: 800,
      }}
    >
      {/* Rotating Card/Coin Container */}
      <div
        ref={coinRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* FRONT FACE - Masked to a perfect circle to ensure a round coin rotation */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            overflow: 'hidden',
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
          }}
        >
          <img
            src="/faoo_logo_2.webp"
            alt="Faoo Logo"
            className="w-full h-full object-cover rounded-full"
            style={{
              backfaceVisibility: 'hidden',
            }}
          />
        </div>

        {/* BACK FACE - Masked to a perfect circle, flipped 180 degrees */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: 'rotateY(180deg)',
            borderRadius: '50%',
            overflow: 'hidden',
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
          }}
        >
          <img
            src="/faoo_logo_2.webp"
            alt="Faoo Logo"
            className="w-full h-full object-cover rounded-full"
            style={{
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
      </div>
    </div>
  );
}
