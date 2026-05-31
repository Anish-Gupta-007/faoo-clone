// src/constants/staticContent.ts
// All homepage static copy lives here

export const HERO_BANNERS = [
  {
    id: 1,
    videoUrl: '/hero_video.mp4',
    mobileVideoUrl: '/mobile_hero_video1.mp4',
    heading: 'Wear the Silence',
    subheading: 'Premium minimalist clothing crafted for those who let the fabric speak.',
    ctaText: 'Shop Mens',
    ctaHref: '/men',
  },
  {
    id: 2,
    videoUrl: '/hero_video2.mp4',
    mobileVideoUrl: '/mobile_hero_video2.mp4',
    heading: 'Effortless Everyday',
    subheading: 'Elevated basics for a life lived with intention.',
    ctaText: 'Shop Women',
    ctaHref: '/women',
  },
  {
    id: 3,
    videoUrl: '/hero_video3.mp4',
    mobileVideoUrl: '/mobile_hero_video3.mp4',
    heading: 'The New Collection',
    subheading: 'Form meets function. Refined for the modern wardrobe.',
    ctaText: 'Explore Now',
    ctaHref: '/collections',
  },
];

export const NEW_COLLECTION = {
  heading: 'The New Collection',
  subheading: 'Refined silhouettes. Breathable fabrics. Made to move with you.',
  ctaText: 'Explore Collection',
  ctaHref: '/men',
  imageUrl: '/collection.webp',
};

export const LIMITED_EDITION = {
  heading: 'Limited Edition',
  tag: 'EXCLUSIVE DROP',
  description:
    'Exclusive styles released in limited quantities and a few sizes. Because not everyone should own the same piece. Make them yours if you find them first.',
  ctaText: 'Shop Limited Edition',
  ctaHref: '/limited-edition',
  imageUrl: '/images/limited-edition.webp',
};

export const ACCESSORIES_SECTION = {
  heading: 'Complete the Look',
  items: [
    { label: 'Caps', href: '/accessories/caps', imageUrl: '/images/acc-caps.webp' },
    { label: 'Bags', href: '/accessories/bags', imageUrl: '/images/acc-bags.webp' },
    { label: 'Bottles', href: '/accessories/bottles', imageUrl: '/images/acc-bottles.webp' },
  ],
};

export const STYLE_IT_WITH_FAOO = {
  heading: 'Style It With Faoo',
  items: [
    { imageUrl: '/images/style-1.webp', caption: 'The Classic Layer' },
    { imageUrl: '/images/style-2.webp', caption: 'Street Edit' },
    { imageUrl: '/images/style-3.webp', caption: 'Monochrome Mood' },
    { imageUrl: '/images/style-4.webp', caption: 'Active Casual' },
    { imageUrl: '/images/style-5.webp', caption: 'Evening Minimal' },
    { imageUrl: '/images/style-6.webp', caption: 'Accessories Edit' },
  ],
};

export const WE_CUSTOMISE = {
  heading: 'We Customise',
  subheading: 'Tailored to Your Vision',
  description:
    'Tailored to your vision, your fit, your size and your occasion. From a request in our existing styles to creating something uniquely yours, we\u2019re here to bring it to life.',
  ctaText: 'Write to Us',
  emailHref: 'mailto:hello@faoo.in',
  features: [
    { title: 'Your Vision', description: 'We start with what you imagine and build from there.' },
    { title: 'Your Fit', description: 'Custom sizing so every piece sits exactly right on you.' },
    { title: 'Your Occasion', description: 'From everyday wear to one-of-a-kind event pieces.' },
  ],
  steps: [
    { label: '01', title: 'Connect', description: 'Share your vision with us via email.' },
    { label: '02', title: 'Consult', description: 'Design refinement and sample creation.' },
    { label: '03', title: 'Craft', description: 'Ethical production and global delivery.' },
  ],
};


export const LAYERING_TIPS = {
  heading: 'The Art of Layering',
  tips: [
    {
      imageUrl: '/cloth1.webp',
      title: 'Start with the Base',
      description: 'A fitted tank or tee forms the perfect canvas for any layered look.',
    },
    {
      imageUrl: '/cloth2.webp',
      title: 'Add Dimension',
      description: 'Throw on an open overshirt or hoodie for depth and texture contrast.',
    },
    {
      imageUrl: '/cloth3.webp',
      title: 'Finish with Edge',
      description: 'A structured jacket or cap ties the look together with intentional edge.',
    },
  ],
};

export const TAKE_A_VACATION = {
  heading: 'As Seen On',
  images: [
    { url: '/images/seen-1.webp', caption: 'Goa Edit' },
    { url: '/images/seen-2.webp', caption: 'Mountain Weekend' },
    { url: '/images/seen-3.webp', caption: 'City Stroll' },
    { url: '/images/seen-4.webp', caption: 'Resort Casual' },
    { url: '/images/seen-5.webp', caption: 'Rooftop Vibes' },
    { url: '/images/seen-6.webp', caption: 'Beach Session' },
  ],
};

export const INSTAGRAM_SECTION = {
  heading: 'Follow Our World',
  handle: '@faoo.official',
  profileUrl: 'https://www.instagram.com/faoo.official',
  posts: [
    { imageUrl: '/insta01.webp', postUrl: 'https://www.instagram.com/p/DXv7bhzExef/' },
    { imageUrl: '/insta02.webp', postUrl: 'https://www.instagram.com/p/DXuMntBk3vK/' },
    { imageUrl: '/images/ig-3.webp', postUrl: 'https://instagram.com/p/3' },
    { imageUrl: '/images/ig-4.webp', postUrl: 'https://instagram.com/p/4' },
    { imageUrl: '/images/ig-5.webp', postUrl: 'https://instagram.com/p/5' },
    { imageUrl: '/images/ig-6.webp', postUrl: 'https://instagram.com/p/6' },
  ],
};



export const CHO_NOTE = {
  name: 'Leo',
  role: 'Chief Happiness Officer',
  note: `At Faoo, we believe clothing is more than just fabric stitched together. It\u2019s a feeling and a way of self expression. #FaooForAll is our initiative to bring you the clothes that are not defined for a certain someone, but everyone and every body. Now go be iconic\u2026 I\u2019ll be cheering for you between naps and snack breaks.`,
  photoUrl: '/Cho.jpeg',
  signature: 'Leo',
};

export const COMMUNITY_SIGNUP = {
  heading: 'Join the Faoo Community',
  subheading: 'Early access to new launches, limited edition collections, styling tips, and zero spam. Only the good stuff.',
};

export const ABOUT_CONTENT = {
  heading: 'About Faoo',
  story: `Faoo comes from a simple belief that fashion is not just about clothing \u2014 it\u2019s about self-expression. Built on the idea of #faooforall, we create pieces designed for everybody and every body, because style should never feel limited by size or labels. Every garment is thoughtfully designed and handcrafted with intention, blending elevated aesthetics with everyday wearability.\n\nAt Faoo, we believe you are fashion. The clothes are simply there to help you express who you already are \u2014 confidently, comfortably, and unapologetically. Whether it\u2019s through our signature collections or custom creations tailored to your vision, we\u2019re here to celebrate individuality in every form and make fashion feel personal to you.`,
  values: [
    {
      letter: 'F',
      title: 'Fashion For All',
      description: 'Style should feel inclusive, effortless, and accessible to everybody and every body. We design pieces that celebrate individuality across all sizes, identities, and expressions.',
    },
    {
      letter: 'A',
      title: 'Artisanal Craftsmanship',
      description: 'Every Faoo piece is thoughtfully handcrafted with care, intention, and attention to detail \u2014 never mass-produced, never rushed. Quality will always remain at the heart of what we create.',
    },
    {
      letter: 'O',
      title: 'Original Expression',
      description: 'We believe clothing should reflect the person wearing it. From our in-house designs to custom-made pieces, we encourage self-expression through fashion that feels personal and authentic.',
    },
    {
      letter: 'O',
      title: 'Own Your Style',
      description: 'Trends may evolve, but confidence never goes out of style. We create designs that help you feel bold, comfortable, and unapologetically yourself.',
    },
  ],
};

export const FAQ_ITEMS = [
  {
    question: 'What is the return policy?',
    answer: 'We accept returns within 7 days of delivery for all non-personalised items. Accessories are non-returnable.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 7–10 business days. Express options are available at checkout.',
  },
  {
    question: 'Do you offer Cash on Delivery?',
    answer: 'Yes, COD is available on most orders. Select COD at checkout to confirm availability for your pincode.',
  },
  {
    question: 'How do I use my FAOO10 coupon?',
    answer: 'Apply code FAOO10 at checkout to receive 10% off your first order. Valid once per account.',
  },
  {
    question: 'Can I customise or place bulk orders?',
    answer: 'Absolutely. Write to us at hello@faoo.in with your requirements and we will get back within 24 hours.',
  },
  {
    question: 'What sizes do you offer?',
    answer: 'We offer sizes from XXS to 3XL across most products. Check the size guide on each product page for exact measurements.',
  },
];

export const CAREERS_CONTENT = {
  heading: 'Join the Faoo Team',
  description: "We are building more than just a brand; we are crafting a new language of silence and fabric. If you believe that design should be intentional, quality should be non-negotiable, and every stitch matters — we want to hear from you.",
  email: 'careers@faoo.in',
  culture: [
    { title: 'Intentional Design', description: 'We don’t follow trends. We create timeless pieces that earn their place in the world.' },
    { title: 'Radical Quality', description: 'Every detail, from thread count to packaging, is scrutinized for perfection.' },
    { title: 'Global Vision', description: 'Based in Bangalore, thinking for the world. We are a diverse, remote-friendly collective.' }
  ],
  openRoles: [
    { 
      title: 'Social Media Manager', 
      type: 'Full-time', 
      location: 'Remote', 
      description: 'Shape our narrative across digital channels. We are looking for an editorial-eye and a community-first mindset.'
    },
    { 
      title: 'Graphic Designer', 
      type: 'Full-time', 
      location: 'Bangalore / Remote', 
      description: 'From lookbooks to interface design, you will be the guardian of our visual language.'
    },
    { 
      title: 'Customer Delight Executive', 
      type: 'Full-time', 
      location: 'Bangalore', 
      description: 'Be the voice of Faoo. We don’t just solve problems; we create memorable experiences.'
    },
  ],
};

export const RETURNS_CONTENT = {
  heading: 'Return & Exchange Policy',
  returns: {
    title: 'Returns',
    items: [
      {
        title: '7-Days Returns',
        description: 'Return items within 7 days after delivery.',
      },
      {
        title: 'Easy Process',
        description: 'Pack in the original condition and hand it over to the pickup.',
      },
      {
        title: 'Fast Refunds',
        description: 'We’ll process refunds within 7-10 business days after receiving the product.',
      },
    ],
  },
  exchange: {
    title: 'Exchange',
    items: [
      {
        title: '7-Days Exchange',
        description: 'Request an exchange within 7 days of delivery.',
      },
      {
        title: 'Easy Process',
        description: 'Pack in the original condition and hand it over to the pickup.',
      },
      {
        title: 'Fast Exchange',
        description: 'Exchanges are processed within 7-10 business days of receiving the item to be exchanged.',
      },
    ],
  },
};

export const POPUP_CONTENT = {
  couponCode: 'FAOO10',
  discountText: 'Get 10% off your first order',
  heading: 'Welcome to Faoo',
  subheading: 'Join us and unlock your first order discount.',
};

