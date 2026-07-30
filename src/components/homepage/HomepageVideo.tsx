'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { shopifyService } from '@/services/shopifyService';

export function HomepageVideo() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await shopifyService.getHomepageVideos();
        if (res.success && res.data && res.data.length > 0) {
          setVideos(res.data);
        } else {
          // Fallback placeholder if no videos in Shopify yet
          setVideos([
            {
              id: 'placeholder-1',
              videoUrl: '/mobile_hero_video1.mp4',
              productName: 'Seamless Sports Bra',
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch homepage videos', error);
        // Fallback
        setVideos([
          {
            id: 'placeholder-1',
            videoUrl: '/mobile_hero_video1.mp4',
            productName: 'Seamless Sports Bra',
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const updateScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      const timer = setTimeout(updateScrollButtons, 100);
      return () => {
        el.removeEventListener('scroll', updateScrollButtons);
        clearTimeout(timer);
      };
    }
  }, [videos, loading]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const firstChild = container.firstElementChild as HTMLElement;
      if (firstChild) {
        const cardWidth = firstChild.getBoundingClientRect().width;
        let gap = 24; // from gap-6
        const secondChild = firstChild.nextElementSibling as HTMLElement;
        if (secondChild) {
          gap = secondChild.getBoundingClientRect().left - firstChild.getBoundingClientRect().right;
        }
        const scrollAmount = cardWidth + gap;
        const targetScroll = direction === 'left'
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth',
        });
      }
    }
  };

  if (loading) return null;
  if (!videos || videos.length === 0) return null;

  return (
    <section className="bg-white py-6 md:py-10 overflow-hidden">
      <div className="container-page px-4 md:px-6">
        
        {/* Navigation buttons for Desktop */}
        <div className="hidden md:flex justify-end gap-4 mb-4 pr-1">
          <button
            onClick={() => scrollCarousel('left')}
            disabled={!canScrollLeft}
            className="flex items-center justify-center text-[#151515] hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous videos"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>
          <button
            onClick={() => scrollCarousel('right')}
            disabled={!canScrollRight}
            className="flex items-center justify-center text-[#151515] hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next videos"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>

        <div 
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden scroll-smooth" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {videos.map((item) => (
                <VideoCard key={item.id} data={item} />
            ))}
         </div>
      </div>
    </section>
  );
}

function VideoCard({ data }: { data: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const productLink = data.productName ? `/search?q=${encodeURIComponent(data.productName)}` : '#';

  return (
    <div className="flex flex-col gap-3 min-w-[280px] w-[280px] md:w-[320px] snap-start shrink-0">
        <div 
            className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-neutral-100 cursor-pointer"
            onClick={togglePlay}
        >
            <video
                ref={videoRef}
                src={data.videoUrl}
                className="w-full h-full object-cover"
                loop
                playsInline
                muted={isMuted}
                autoPlay
            />
            {/* Play/Pause indicator overlay */}
            <div className={`absolute inset-0 bg-black/10 flex items-center justify-center transition-opacity ${!isPlaying ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                {!isPlaying && (
                    <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white">
                        <Play fill="currentColor" size={20} className="ml-1" />
                    </div>
                )}
            </div>
            
            <button 
                onClick={toggleMute}
                className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white z-10"
            >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
        </div>
        <Link href={productLink} className="text-[13px] md:text-sm font-sans font-medium text-[#151515] hover:text-[#8b0026] transition-colors">
            {data.productName}
        </Link>
    </div>
  );
}
