// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F8F5]">
      <div className="text-center px-6">
        <h1 className="font-display font-black text-[#0A0A0A] text-6xl md:text-8xl mb-4">404</h1>
        <p className="font-sans text-[#3a3a3a] text-lg mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-[#0A0A0A] text-white font-sans font-medium hover:bg-[#c9a84c] transition-colors duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
