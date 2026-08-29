import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Calendar, ArrowUpRight } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
  onTagClick?: (tag: string) => void;
  className?: string;
}

export function BlogCard({ post, onTagClick, className = '' }: BlogCardProps) {
  const navigate = useNavigate();

  const formattedDate = new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Calculate read time if not provided
  const readTime = post.read_time_minutes || Math.max(1, Math.ceil((post.content || '').split(/\s+/).filter(Boolean).length / 200));

  const handleCardClick = (e: React.MouseEvent) => {
    // If the click was on a tag button, don't navigate to the post
    if ((e.target as HTMLElement).closest('[data-tag-pill="true"]')) {
      return;
    }
    navigate(`/blog/${post.slug}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between rounded-2xl border border-[#D7E2EA]/15 bg-[var(--bg-tertiary)] p-6 sm:p-8 transition-all duration-300 hover:border-[var(--text-primary)]/40 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)] cursor-pointer text-left ${className}`}
    >
      <div className="space-y-4">
        {/* Meta Info: Date and Read Time */}
        <div className="flex items-center gap-3 text-xs text-[var(--text-primary)]/50 tracking-wider">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 opacity-70" />
            {formattedDate}
          </span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-primary)]/30" />
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 opacity-70" />
            {readTime} min read
          </span>
        </div>

        {/* Title */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-[#D7E2EA] group-hover:text-[var(--text-highlight)] transition-colors duration-200 leading-snug">
            <Link 
              to={`/blog/${post.slug}`} 
              onClick={(e) => e.stopPropagation()} 
              className="hover:underline focus:outline-none"
            >
              {post.title}
            </Link>
          </h3>
          <div className="shrink-0 w-8 h-8 rounded-full border border-[#D7E2EA]/20 flex items-center justify-center text-[#D7E2EA]/60 group-hover:text-[var(--text-primary)] group-hover:border-[var(--text-primary)]/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 mt-0.5">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Excerpt (2-3 lines, opacity 70%) */}
        {post.excerpt && (
          <p className="text-sm sm:text-base text-[var(--text-primary)]/70 font-light leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Keywords / Hashtags */}
      {post.keywords && post.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-6 pt-5 border-t border-[var(--text-primary)]/10">
          {post.keywords.map((kw) => {
            const cleanTag = kw.replace(/^#/, '').trim();
            if (!cleanTag) return null;
            return (
              <button
                key={cleanTag}
                type="button"
                data-tag-pill="true"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTagClick) {
                    onTagClick(cleanTag);
                  } else {
                    navigate(`/blog?tag=${encodeURIComponent(cleanTag)}`);
                  }
                }}
                className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#D7E2EA]/20 bg-[var(--bg-primary)]/50 text-[11px] sm:text-xs text-[var(--text-primary)]/70 hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]/60 hover:bg-[var(--text-primary)]/10 transition-colors duration-150 cursor-pointer"
              >
                #{cleanTag}
              </button>
            );
          })}
        </div>
      )}
    </article>
  );
}
