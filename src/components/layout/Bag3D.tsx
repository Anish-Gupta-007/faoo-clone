'use client';
// src/components/layout/Bag3D.tsx — Modern Luxury Edition

import { useEffect, useRef } from 'react';

export function Bag3D() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    let angle = 18;
    const tick = () => {
      angle += 0.3;
      if (sceneRef.current) {
        sceneRef.current.style.transform = `rotateX(-5deg) rotateY(${angle}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ── Modern bag proportions: slightly wider, cleaner ── */
  const W  = 90;   // width
  const H  = 118;  // height
  const D  = 32;   // depth
  const hH = 42;   // handle height above top

  const hSpan = W * 0.58;
  const hLeft = (W - hSpan) / 2;

  /* Shared modern typography style */
  const brandStyle: React.CSSProperties = {
    fontFamily: '"Helvetica Neue", "Helvetica", Arial, sans-serif',
    fontSize: 12,
    fontWeight: 300,
    letterSpacing: '0.55em',
    textTransform: 'uppercase',
    color: '#111',
    userSelect: 'none',
    paddingLeft: '0.55em', /* optical correction for letter-spacing */
  };

  return (
    <div style={{
      width: W,
      height: H + hH + 14,
      perspective: 540,
      perspectiveOrigin: '50% 50%',
    }}>

      {/* ── 3-D scene ── */}
      <div
        ref={sceneRef}
        style={{
          width: W,
          height: H,
          marginTop: hH,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(-5deg) rotateY(18deg)',
          willChange: 'transform',
          overflow: 'visible',
        }}
      >

        {/* ════════════════════════════════════════
            FRONT FACE  — modern white
        ════════════════════════════════════════ */}
        <div style={{
          position: 'absolute',
          width: W, height: H,
          background: 'linear-gradient(170deg, #ffffff 0%, #f8f7f4 55%, #f1eee8 100%)',
          transform: `translateZ(${D / 2}px)`,
          backfaceVisibility: 'hidden',
          borderRadius: '1px 1px 2px 2px',
          overflow: 'hidden',
        }}>
          {/* — diagonal light bloom (top-left) */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(128deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 32%, transparent 55%)',
            pointerEvents: 'none',
          }} />

          {/* — left edge brightness */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(255,255,255,0.45) 0%, transparent 14%)',
            pointerEvents: 'none',
          }} />

          {/* — inner architectural frame */}
          <div style={{
            position: 'absolute',
            top: 10, left: 10, right: 10, bottom: 10,
            border: '0.5px solid rgba(0,0,0,0.09)',
            borderRadius: '0.5px',
            pointerEvents: 'none',
          }} />

          {/* — brand layout */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}>
            {/* top hairline rule */}
            <div style={{
              width: 28,
              height: '0.5px',
              background: 'rgba(0,0,0,0.25)',
            }} />

            <span style={brandStyle}>FAOO</span>

            {/* bottom hairline rule */}
            <div style={{
              width: 28,
              height: '0.5px',
              background: 'rgba(0,0,0,0.25)',
            }} />
          </div>
        </div>

        {/* ════════════════════════════════════════
            BACK FACE  — same modern branding
            Content uses scaleX(-1) to un-mirror text
        ════════════════════════════════════════ */}
        <div style={{
          position: 'absolute',
          width: W, height: H,
          background: 'linear-gradient(170deg, #f8f7f4 0%, #f0ede7 55%, #eae7e1 100%)',
          transform: `rotateY(180deg) translateZ(${D / 2}px)`,
          backfaceVisibility: 'hidden',
          borderRadius: '1px 1px 2px 2px',
          overflow: 'hidden',
        }}>
          {/* inner frame */}
          <div style={{
            position: 'absolute',
            top: 10, left: 10, right: 10, bottom: 10,
            border: '0.5px solid rgba(0,0,0,0.09)',
            borderRadius: '0.5px',
            pointerEvents: 'none',
          }} />

          {/* scaleX(-1) removed — two rotateY(180°) cancel, text is naturally correct */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}>
            <div style={{ width: 28, height: '0.5px', background: 'rgba(0,0,0,0.22)' }} />
            <span style={brandStyle}>FAOO</span>
            <div style={{ width: 28, height: '0.5px', background: 'rgba(0,0,0,0.22)' }} />
          </div>
        </div>

        {/* ════════════════════════════════════════
            LEFT FACE — gusset fold (3-stop)
        ════════════════════════════════════════ */}
        <div style={{
          position: 'absolute',
          width: D, height: H,
          left: -(D / 2),
          top: 0,
          background: 'linear-gradient(to right, #dddad4 0%, #c8c4be 40%, #bfbbb5 50%, #c6c2bc 60%, #dddad4 100%)',
          transform: 'rotateY(-90deg)',
          backfaceVisibility: 'hidden',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: '50%',
            width: '0.5px',
            background: 'rgba(0,0,0,0.08)',
          }} />
        </div>

        {/* ════════════════════════════════════════
            RIGHT FACE — gusset fold (3-stop)
        ════════════════════════════════════════ */}
        <div style={{
          position: 'absolute',
          width: D, height: H,
          left: W - D / 2,
          top: 0,
          background: 'linear-gradient(to right, #dddad4 0%, #cac6c0 40%, #c0bcb6 50%, #c8c4be 60%, #dddad4 100%)',
          transform: 'rotateY(90deg)',
          backfaceVisibility: 'hidden',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: '50%',
            width: '0.5px',
            background: 'rgba(0,0,0,0.08)',
          }} />
        </div>

        {/* ════════════════════════════════════════
            TOP FACE
        ════════════════════════════════════════ */}
        <div style={{
          position: 'absolute',
          width: W, height: D,
          top: -(D / 2),
          left: 0,
          background: 'linear-gradient(to bottom, #eae7e1, #d4d0ca)',
          transform: 'rotateX(90deg)',
          backfaceVisibility: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}>
          <div style={{ width: 8, height: 4, background: 'rgba(0,0,0,0.30)', borderRadius: '50%' }} />
          <div style={{ width: 8, height: 4, background: 'rgba(0,0,0,0.30)', borderRadius: '50%' }} />
        </div>

        {/* ════════════════════════════════════════
            BOTTOM FACE
        ════════════════════════════════════════ */}
        <div style={{
          position: 'absolute',
          width: W, height: D,
          top: H - D / 2,
          left: 0,
          background: '#c2beb8',
          transform: 'rotateX(-90deg)',
          backfaceVisibility: 'hidden',
        }} />

        {/* ════════════════════════════════════════
            HANDLES — wide flat grosgrain tape
        ════════════════════════════════════════ */}
        {(['front', 'back'] as const).map((face) => (
          <LoopHandle
            key={face}
            span={hSpan}
            left={hLeft}
            height={hH}
            tz={D / 2}
            rotY={face === 'front' ? 0 : 180}
          />
        ))}

      </div>{/* /scene */}

      {/* ground reflection */}
      <div style={{
        marginTop: 4,
        marginLeft: '6%',
        width: '88%',
        height: 10,
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.16) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />

    </div>
  );
}

/* ── Modern Rectangular Loop Handle ── */
function LoopHandle({
  span, left, height, tz, rotY,
}: {
  span: number;
  left: number;
  height: number;
  tz: number;
  rotY: number;
}) {
  const sw  = 7;     /* stroke width */
  const lx  = sw / 2;
  const rx  = span - sw / 2;
  const r   = 9;     /* corner radius */
  const top = 4;     /* top y (with radius room) */

  /* Rectangular loop path: down-left → corner → across top → corner → down-right */
  const loop = [
    `M ${lx} ${height}`,
    `L ${lx} ${top + r}`,
    `Q ${lx} ${top} ${lx + r} ${top}`,
    `L ${rx - r} ${top}`,
    `Q ${rx} ${top} ${rx} ${top + r}`,
    `L ${rx} ${height}`,
  ].join(' ');

  return (
    <div style={{
      position: 'absolute',
      top: -height,
      left,
      width: span,
      height,
      transform: `rotateY(${rotY}deg) translateZ(${tz}px)`,
      backfaceVisibility: 'hidden',
      pointerEvents: 'none',
    }}>
      <svg width={span} height={height} viewBox={`0 0 ${span} ${height}`} overflow="visible">

        {/* cast shadow */}
        <path d={loop} fill="none"
          stroke="rgba(0,0,0,0.25)" strokeWidth={sw + 5} strokeLinecap="square"
          strokeLinejoin="round" />

        {/* handle body — deep charcoal */}
        <path d={loop} fill="none"
          stroke="#1e1c19" strokeWidth={sw} strokeLinecap="square"
          strokeLinejoin="round" />

        {/* inner edge highlight (gives rope/leather thickness) */}
        <path d={loop} fill="none"
          stroke="rgba(255,255,255,0.14)" strokeWidth={sw * 0.35}
          strokeLinecap="square" strokeLinejoin="round" />

        {/* top-edge shine */}
        <path d={loop} fill="none"
          stroke="rgba(255,255,255,0.08)" strokeWidth={1}
          strokeLinecap="square" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
