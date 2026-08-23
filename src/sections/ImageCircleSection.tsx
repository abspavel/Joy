import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform, useInView, MotionValue, AnimatePresence } from 'motion/react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { X } from 'lucide-react';

const FALLBACK_OUTER = Array.from({ length: 21 }, (_, i) => ({ id: `outer-${i}`, image_url: `/photo${i + 1}.jpg`, ring: 'outer' }));
const FALLBACK_INNER = Array.from({ length: 7 }, (_, i) => ({ id: `inner-${i}`, image_url: `/photo${i + 22}.jpg`, ring: 'inner' }));

export function ImageCircleSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "400px" });
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    if (isInView && !hasMounted) setHasMounted(true);
  }, [isInView, hasMounted]);
  const { data, loading } = usePortfolioData('circle_photos');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const outerPhotos = data ? data.filter(p => p.ring === 'outer') : [];
  const innerPhotos = data ? data.filter(p => p.ring === 'inner') : [];

  const outerAngle = useMotionValue(0);
  const innerAngle = useMotionValue(0);

  // Outer ring: ~36s per rotation (10 degrees per second)
  // Inner ring: ~24s per rotation (15 degrees per second, opposite direction)
  useAnimationFrame((t, delta) => {
    if (isInView && !selectedPhoto) {
      if (outerPhotos.length > 0) outerAngle.set(outerAngle.get() + (delta / 1000) * 10);
      if (innerPhotos.length > 0) innerAngle.set(innerAngle.get() - (delta / 1000) * 15);
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    if (selectedPhoto) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  return (
    <section 
      id="image-circle" 
      ref={containerRef}
      className="bg-[var(--bg-primary)] py-20 sm:py-28 md:py-36 relative flex flex-col items-center justify-center overflow-hidden z-10"
    >
      <div className="relative flex justify-center items-center w-full max-w-7xl mx-auto min-h-[clamp(320px,80vw,860px)]">
        
        {!hasMounted ? null : (
          <>
            {/* Outer Ring */}
            {outerPhotos.length > 0 && (
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(260px,65vw,700px)] h-[clamp(260px,65vw,700px)] will-change-transform"
                style={{ rotate: outerAngle }}
              >
                {outerPhotos.map((photo, i) => (
                  <CircleItem 
                    key={photo.id || `outer-${i}`}
                    photoUrl={photo.image_url}
                    angle={i * (360 / outerPhotos.length)}
                    ringAngle={outerAngle}
                    sizeClasses="w-12 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24"
                    onClick={() => setSelectedPhoto(photo.image_url)}
                  />
                ))}
              </motion.div>
            )}

            {/* Inner Ring */}
            {innerPhotos.length > 0 && (
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(120px,30vw,320px)] h-[clamp(120px,30vw,320px)] will-change-transform"
                style={{ rotate: innerAngle }}
              >
                {innerPhotos.map((photo, i) => (
                  <CircleItem 
                    key={photo.id || `inner-${i}`}
                    photoUrl={photo.image_url}
                    angle={i * (360 / innerPhotos.length)}
                    ringAngle={innerAngle}
                    sizeClasses="w-14 h-20 sm:w-20 sm:h-28 md:w-24 md:h-32"
                    onClick={() => setSelectedPhoto(photo.image_url)}
                  />
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button 
              className="absolute top-6 right-6 text-[var(--text-primary)] hover:text-white transition-colors z-[101] bg-black/50 p-2 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(null);
              }}
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            <motion.img 
              src={selectedPhoto}
              alt="Preview"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function CircleItem({
  photoUrl,
  angle,
  ringAngle,
  sizeClasses,
  onClick
}: {
  photoUrl: string;
  angle: number;
  ringAngle: MotionValue<number>;
  sizeClasses: string;
  onClick: () => void;
  key?: React.Key;
}) {
  // Counter-rotate the item to keep the photo completely upright at all times.
  // It counteracts its fixed angle position and the dynamic rotation of its parent ring.
  const counterRotation = useTransform(ringAngle, (v) => -v - angle);

  return (
    <div
      className="absolute top-1/2 left-1/2 w-full h-full pointer-events-none"
      style={{
        transform: `translate(-50%, -50%) rotate(${angle}deg)`
      }}
    >
      <motion.div
        className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-[var(--bg-secondary)] border-2 border-[var(--text-primary)]/30 rounded-xl will-change-transform pointer-events-auto shadow-xl cursor-pointer hover:border-[var(--text-primary)]/80 transition-colors ${sizeClasses}`}
        style={{ rotate: counterRotation }}
        onClick={onClick}
      >
        <img
          src={photoUrl}
          alt="Gallery"
          loading="lazy"
          width="800"
          height="800"
          style={{ aspectRatio: '1/1' }}
          className="w-full h-full object-cover object-center pointer-events-none"
          onError={(e) => { 
            // Fallback for missing placeholder images
            e.currentTarget.style.opacity = '0'; 
            e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
            if (e.currentTarget.parentElement) {
                const span = document.createElement('span');
                span.className = 'text-[var(--text-primary)]/30 text-[10px] font-medium uppercase absolute';
                span.innerText = 'IMG';
                e.currentTarget.parentElement.appendChild(span);
            }
          }}
        />
      </motion.div>
    </div>
  );
}
