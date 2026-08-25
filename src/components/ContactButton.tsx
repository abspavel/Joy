import { Link } from 'react-router-dom';

export function ContactButton({ className = "", children = "Contact Me" }: { className?: string, children?: React.ReactNode }) {
  return (
    <Link
      to="/contact"
      className={`inline-block rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base text-white font-medium uppercase tracking-widest relative overflow-hidden transition-transform hover:scale-105 active:scale-95 z-10 ${className}`}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid white',
        outlineOffset: '-3px'
      }}
    >
      {children}
    </Link>
  );
}

