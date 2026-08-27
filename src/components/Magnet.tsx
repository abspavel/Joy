import { ReactNode, useRef, useState, MouseEvent } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = '',
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      if (!ref.current) return;
      if (
        Math.abs(distanceX) < width / 2 + padding &&
        Math.abs(distanceY) < height / 2 + padding
      ) {
        ref.current.style.transition = activeTransition;
        ref.current.style.transform = `translate3d(${distanceX / strength}px, ${distanceY / strength}px, 0)`;
      } else {
        ref.current.style.transition = inactiveTransition;
        ref.current.style.transform = `translate3d(0px, 0px, 0)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!ref.current) return;
    ref.current.style.transition = inactiveTransition;
    ref.current.style.transform = `translate3d(0px, 0px, 0)`;
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
