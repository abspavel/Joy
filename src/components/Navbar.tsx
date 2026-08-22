import { Link, useLocation } from 'react-router-dom';
import { FadeIn } from './FadeIn';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const location = useLocation();

  return (
    <FadeIn delay={0} y={-20} as="nav" className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8 relative z-40 w-full">
      <Link to="/" className="text-xl md:text-2xl font-bold tracking-tighter text-[var(--text-primary)]">JOY</Link>
      <div className="flex gap-4 sm:gap-8 md:gap-12 items-center">
        {['About', 'Projects'].map((item) => (
          <a
            key={item}
            href={`/#${item.toLowerCase()}`}
            className="text-[var(--text-primary)] font-medium uppercase tracking-wider text-xs sm:text-sm md:text-lg lg:text-[1.2rem] hover:opacity-70 transition-opacity duration-200 py-2"
          >
            {item}
          </a>
        ))}
        <Link
          to="/contact"
          className={`text-[var(--text-primary)] ${location.pathname === '/contact' ? 'font-bold' : 'font-medium'} uppercase tracking-wider text-xs sm:text-sm md:text-lg lg:text-[1.2rem] hover:opacity-70 transition-opacity duration-200 py-2`}
        >
          CONTACT
        </Link>
        <ThemeToggle />
      </div>
    </FadeIn>
  );
}
