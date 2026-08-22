import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export function AnimatedText({ text, className = '' }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.5'],
  });

  const words = text.split(' ');

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

const Word: React.FC<{
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}> = ({ children, progress, range }) => {
  const amount = range[1] - range[0];
  const step = amount / children.length;

  return (
    <span className="relative inline-block mr-1 sm:mr-1.5 md:mr-2 mt-1 sm:mt-1.5 md:mt-2">
      {children.split('').map((char, i) => {
        const start = range[0] + i * step;
        const end = range[0] + (i + 1) * step;
        return (
          <Char key={i} progress={progress} range={[start, end]}>
            {char}
          </Char>
        );
      })}
    </span>
  );
};

const Char: React.FC<{
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span>
      <span className="absolute opacity-0">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
};

