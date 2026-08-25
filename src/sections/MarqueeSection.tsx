import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const MarqueeImage: React.FC<{ src: string; index: number }> = ({ src, index }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <img decoding="async" 
      src={src}
      alt="3D Creative Portfolio"
      width="420"
      height="270"
      loading={index < 4 ? "eager" : "lazy"}
      onLoad={() => setLoaded(true)}
      style={{ aspectRatio: '420/270' }}
      className={`w-[160px] h-[100px] sm:w-[280px] sm:h-[180px] md:w-[420px] md:h-[270px] rounded-2xl object-cover object-center shrink-0 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}

const getRepeatedArray = (arr: string[]) => {
  if (arr.length === 0) return [];
  let result = [...arr];
  // Ensure we have at least 10 items in the base array to cover wide screens
  while (result.length < 10) {
    result = [...result, ...arr];
  }
  // Duplicate it once more to ensure exactly 50% translation perfectly loops
  return [...result, ...result];
};

export function MarqueeSection() {
  const [row1Original, setRow1Original] = useState<string[]>([]);
  const [row2Original, setRow2Original] = useState<string[]>([]);
  const [row3Original, setRow3Original] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('marquee_images')
          .select('*')
          .order('order_index', { ascending: true });

        if (!error && data) {
          // Exclude any previous Unsplash demo images and show only user-uploaded photos
          const userPhotos = data.filter(img => !img.image_url.includes('unsplash.com'));
          const row1 = userPhotos.filter(img => img.row_number === 1).map(img => img.image_url);
          const row2 = userPhotos.filter(img => img.row_number === 2).map(img => img.image_url);
          const row3 = userPhotos.filter(img => img.row_number === 3).map(img => img.image_url);
          setRow1Original(row1);
          setRow2Original(row2);
          setRow3Original(row3);
        } else {
          setRow1Original([]);
          setRow2Original([]);
          setRow3Original([]);
        }
      } catch (err) {
        setRow1Original([]);
        setRow2Original([]);
        setRow3Original([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return <div className="h-40 bg-[var(--bg-primary)]"></div>; // Placeholder while loading
  }

  if (row1Original.length === 0 && row2Original.length === 0 && row3Original.length === 0) {
    return null;
  }

  const row1Images = getRepeatedArray(row1Original);
  const row2Images = getRepeatedArray(row2Original);
  const row3Images = getRepeatedArray(row3Original);

  return (
    <section 
      className="bg-[var(--bg-primary)] pt-4 sm:pt-6 md:pt-8 pb-10 overflow-hidden flex flex-col gap-2 md:gap-3"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)'
      }}
    >
      <style>
        {`
          @keyframes marquee-left {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0%); }
          }
          .animate-marquee-left {
            animation: marquee-left 40s linear infinite;
          }
          .animate-marquee-right {
            animation: marquee-right 40s linear infinite;
          }
        `}
      </style>
      
      {row1Images.length > 0 && (
        <div className="flex flex-nowrap w-max gap-2 md:gap-3 shrink-0 animate-marquee-right hover:[animation-play-state:paused]">
          {row1Images.map((src, i) => (
            <MarqueeImage key={`row1-${i}`} src={src} index={i} />
          ))}
        </div>
      )}

      {row2Images.length > 0 && (
        <div className="flex flex-nowrap w-max gap-2 md:gap-3 shrink-0 animate-marquee-left hover:[animation-play-state:paused]">
          {row2Images.map((src, i) => (
            <MarqueeImage key={`row2-${i}`} src={src} index={i} />
          ))}
        </div>
      )}

      {row3Images.length > 0 && (
        <div className="flex flex-nowrap w-max gap-2 md:gap-3 shrink-0 animate-marquee-right hover:[animation-play-state:paused]">
          {row3Images.map((src, i) => (
            <MarqueeImage key={`row3-${i}`} src={src} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
