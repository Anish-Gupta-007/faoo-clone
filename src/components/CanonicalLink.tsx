'use client';

import { usePathname } from 'next/navigation';

export default function CanonicalLink() {
  const pathname = usePathname();
  const siteUrl = 'https://www.shopfaoo.com';
  
  return <link rel="canonical" href={`${siteUrl}${pathname}`} />;
}
