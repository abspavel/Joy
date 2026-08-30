import React from 'react';
import { Link } from 'react-router-dom';
import { FadeIn } from '../components/FadeIn';
import { BlogCard } from '../components/BlogCard';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '../types';

export function BlogSection() {
  const { data: postsData, loading } = usePortfolioData('blog_posts');

  // Filter only published posts and sort by published_at desc
  const publishedPosts: BlogPost[] = (postsData || [])
    .filter((post: BlogPost) => post.published !== false)
    .sort((a: BlogPost, b: BlogPost) => {
      const timeA = new Date(a.published_at || a.created_at).getTime();
      const timeB = new Date(b.published_at || b.created_at).getTime();
      return timeB - timeA;
    });

  // Show up to 4 most recent posts on homepage
  const recentPosts = publishedPosts.slice(0, 4);

  if (!loading && publishedPosts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="bg-[var(--bg-primary)] px-5 sm:px-8 md:px-10 py-20 sm:py-28 md:py-32 relative z-10 border-t border-[var(--text-primary)]/5">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16 md:mb-20">
          <FadeIn delay={0} y={25}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-8 bg-[var(--text-highlight)]/40" />
              <span className="text-[var(--text-highlight)] text-xs sm:text-sm font-semibold tracking-widest uppercase">
                ARTICLES & INSIGHTS
              </span>
              <span className="h-px w-8 bg-[var(--text-highlight)]/40" />
            </div>
            <h2 className="hero-heading font-black uppercase tracking-tight text-[clamp(2.5rem,10vw,100px)] leading-none mb-4">
              LATEST ARTICLES
            </h2>
          </FadeIn>

          <FadeIn delay={0.1} y={20}>
            <p className="text-[var(--text-primary)]/70 font-light text-sm sm:text-base md:text-lg max-w-2xl">
              Architectural notes, performance insights, and technical musings on modern web development and frontend engineering.
            </p>
          </FadeIn>
        </div>

        {/* Text-Only Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {recentPosts.map((post, index) => (
            <FadeIn key={post.id || post.slug} delay={0.1 + index * 0.08} y={30}>
              <BlogCard post={post} />
            </FadeIn>
          ))}
        </div>

        {/* View All Posts Button */}
        {publishedPosts.length > 0 && (
          <FadeIn delay={0.3} y={20} className="flex justify-center items-center">
            <Link
              to="/blog"
              id="blog-view-all-btn"
              className="group inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-3.5 rounded-full border border-[var(--text-primary)]/20 bg-[var(--bg-secondary)] hover:bg-[var(--text-primary)] text-[var(--text-primary)] hover:text-[var(--bg-primary)] font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
            >
              <span>View All Articles ({publishedPosts.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
