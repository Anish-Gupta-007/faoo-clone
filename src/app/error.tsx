// src/app/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F8F5]">
      <div className="text-center px-6">
        <h1 className="font-display font-black text-[#0A0A0A] text-6xl md:text-8xl mb-4">500</h1>
        <p className="font-sans text-[#3a3a3a] text-lg mb-8">Something went wrong</p>
        <button
          onClick={reset}
          className="inline-block px-8 py-3 bg-[#0A0A0A] text-white font-sans font-medium hover:bg-[#c9a84c] transition-colors duration-300"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
