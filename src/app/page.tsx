// src/app/page.tsx
import { Metadata } from 'next';
import { HeroBanner } from '@/components/homepage/HeroBanner';
import { NewCollection } from '@/components/homepage/NewCollection';
import { LimitedEdition } from '@/components/homepage/LimitedEdition';

import { StyleItWithFaoo } from '@/components/homepage/StyleItWithFaoo';
import { WeCustomise } from '@/components/homepage/WeCustomise';
// import { LayeringTips } from '@/components/homepage/LayeringTips';
import { InstagramSection } from '@/components/homepage/InstagramSection';
import { ScrollTransitionWrapper } from '@/components/homepage/ScrollTransitionWrapper';

export const metadata: Metadata = {
  title: 'Faoo — Premium Minimalist Clothing',
  description:
    'Shop premium minimalist clothing for men and women. T-Shirts, Hoodies, Tanks, Joggers and Accessories. Free shipping on select orders.',
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <NewCollection />
      {/* <LimitedEdition /> */}

      <StyleItWithFaoo />
      <WeCustomise />
      {/* <LayeringTips /> */}
      <InstagramSection />
      <ScrollTransitionWrapper />
    </>
  );
}
