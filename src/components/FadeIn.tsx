import React, { ReactNode, ElementType, useEffect, useRef, useState } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  as?: ElementType;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className = '',
  as = 'div'
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    // Safety fallback: if IntersectionObserver is missing, default to visible immediately
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Once the element enters the viewport (with 50px margin), trigger the animation
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // ensure "once: true" behavior
        }
      },
      {
        rootMargin: '50px',
        threshold: 0
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate(0px, 0px)' : `translate(${x}px, ${y}px)`,
    transition: `opacity ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s, transform ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s`,
    willChange: 'opacity, transform',
  };

  const Tag = as as any;

  return (
    <Tag ref={elementRef} className={className} style={style}>
      {children}
    </Tag>
  );
};

