import React, { useState } from 'react';
import { usePortfolioData } from '../hooks/usePortfolioData';

const MarqueeImage: React.FC<{ src: string; index: number }> = ({ src, index }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <img decoding="async" 
      src={src}
      alt="3D Creative Portfolio"
      width="420"
      height="270"
      fetchPriority={index < 2 ? "high" : "auto"}
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
  const { data, loading } = usePortfolioData('marquee_images');
  
  if (loading) {
    return <div className="h-[372px] sm:h-[628px] md:h-[906px] w-full bg-[var(--bg-primary)]"></div>; // Placeholder while loading
  }
  
  if (!data || data.length === 0) {
    return null;
  }

  // Exclude any previous Unsplash demo images and show only user-uploaded photos
  const userPhotos = data.filter(img => !img.image_url.includes('unsplash.com'));
  const row1Original = userPhotos.filter(img => img.row_number === 1).map(img => img.image_url);
  const row2Original = userPhotos.filter(img => img.row_number === 2).map(img => img.image_url);
  const row3Original = userPhotos.filter(img => img.row_number === 3).map(img => img.image_url);

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
