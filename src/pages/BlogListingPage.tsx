import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { FooterSection } from '../sections/FooterSection';
import { BlogCard } from '../components/BlogCard';
import { FadeIn } from '../components/FadeIn';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useSEO } from '../hooks/useSEO';
import { generateMetadata } from '../utils/metadata';
import { Search, Tag, X, BookOpen, ArrowLeft } from 'lucide-react';
import { BlogPost } from '../types';

export function BlogListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get('tag') || '';
  const [searchQuery, setSearchQuery] = useState('');

  const { data: rawPosts, loading } = usePortfolioData('blog_posts');

  // Filter only published posts
  const allPosts: BlogPost[] = useMemo(() => {
    return (rawPosts || [])
      .filter((post: BlogPost) => post.published !== false)
      .sort((a: BlogPost, b: BlogPost) => {
        const timeA = new Date(a.published_at || a.created_at).getTime();
        const timeB = new Date(b.published_at || b.created_at).getTime();
        return timeB - timeA;
      });
  }, [rawPosts]);

  // Extract unique keywords/tags from all posts
  const allTags = useMemo(() => {
    const set = new Set<string>();
    allPosts.forEach(post => {
      if (Array.isArray(post.keywords)) {
        post.keywords.forEach(k => {
          const clean = k.replace(/^#/, '').trim();
          if (clean) set.add(clean);
        });
      }
    });
    return Array.from(set);
  }, [allPosts]);

  // Filter posts based on active tag and search query
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      // Tag match
      if (activeTag) {
        const hasTag = post.keywords?.some(k => 
          k.replace(/^#/, '').trim().toLowerCase() === activeTag.toLowerCase()
        );
        if (!hasTag) return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = post.title.toLowerCase().includes(q);
        const excerptMatch = (post.excerpt || '').toLowerCase().includes(q);
        const contentMatch = (post.content || '').toLowerCase().includes(q);
        const tagsMatch = post.keywords?.some(k => k.toLowerCase().includes(q));
        if (!titleMatch && !excerptMatch && !contentMatch && !tagsMatch) {
          return false;
        }
      }

      return true;
    });
  }, [allPosts, activeTag, searchQuery]);

  const handleSelectTag = (tag: string) => {
    if (activeTag.toLowerCase() === tag.toLowerCase()) {
      searchParams.delete('tag');
    } else {
      searchParams.set('tag', tag);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    searchParams.delete('tag');
    setSearchParams(searchParams);
    setSearchQuery('');
  };

  // Centralized metadata generation for blog listing
  const listingMetadata = useMemo(() => {
    return generateMetadata.listing(activeTag, {
      url: typeof window !== 'undefined' ? window.location.href : 'https://joy.dev/blog',
    });
  }, [activeTag]);

  useSEO(listingMetadata);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col selection:bg-[var(--text-highlight)] selection:text-[var(--bg-primary)]">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-12 sm:pt-16 md:pt-20 pb-20 sm:pb-28">
        {/* Back Link */}
        <FadeIn delay={0} y={15} className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[var(--text-primary)]/60 hover:text-[var(--text-primary)] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Homepage</span>
          </Link>
        </FadeIn>

        {/* Page Header */}
        <div className="mb-12 sm:mb-16">
          <FadeIn delay={0.05} y={20}>
            <span className="text-xs uppercase tracking-widest text-[var(--text-primary)]/50 font-mono block mb-2">
              Writing &amp; Architectural Notes
            </span>
            <h1 className="hero-heading font-black uppercase text-[clamp(2.5rem,7vw,70px)] leading-none mb-4">
              BLOG &amp; INSIGHTS
            </h1>
          </FadeIn>
          <FadeIn delay={0.1} y={20}>
            <p className="text-[var(--text-primary)]/70 text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed font-light">
              In-depth articles covering interactive 3D WebGL workflows, performance budgeting, physics-based UI animation, and high-conversion frontend craftsmanship. Pure text, zero distractions.
            </p>
          </FadeIn>
        </div>

        {/* Controls: Search and Tag Filters */}
        <FadeIn delay={0.15} y={20} className="space-y-6 mb-12 sm:mb-16">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-primary)]/40 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, keyword, or topic..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--text-primary)]/15 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-primary)]/40 focus:outline-none focus:border-[var(--text-primary)]/50 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-primary)]/40 hover:text-[var(--text-primary)] p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Total count / Active filter notice */}
            <div className="flex items-center gap-3 text-xs text-[var(--text-primary)]/60 shrink-0">
              <span>Showing {filteredPosts.length} of {allPosts.length} articles</span>
              {(activeTag || searchQuery) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1 text-[var(--text-primary)] underline hover:opacity-75 transition-opacity cursor-pointer font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Tags Bar */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              <span className="text-xs uppercase tracking-wider text-[var(--text-primary)]/40 font-mono shrink-0 flex items-center gap-1 mr-1">
                <Tag className="w-3 h-3" /> Topics:
              </span>
              <button
                type="button"
                onClick={() => {
                  searchParams.delete('tag');
                  setSearchParams(searchParams);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  !activeTag
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]/70 border border-[var(--text-primary)]/15 hover:border-[var(--text-primary)]/40'
                }`}
              >
                All Topics
              </button>
              {allTags.map((tag) => {
                const isSelected = activeTag.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSelectTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]/70 border border-[var(--text-primary)]/15 hover:border-[var(--text-primary)]/40'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          )}
        </FadeIn>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            {filteredPosts.map((post, index) => (
              <FadeIn key={post.id || post.slug} delay={0.05 * (index % 6)} y={25}>
                <BlogCard
                  post={post}
                  onTagClick={(tag) => handleSelectTag(tag)}
                />
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-2xl border border-[var(--text-primary)]/10 bg-[var(--bg-secondary)]/50 p-8">
            <BookOpen className="w-10 h-10 mx-auto text-[var(--text-primary)]/30 mb-3" />
            <h3 className="text-lg font-medium mb-2">No articles match your criteria</h3>
            <p className="text-sm text-[var(--text-primary)]/60 max-w-md mx-auto mb-6">
              Try adjusting your search query or removing the active tag filter.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-5 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      <FooterSection />
    </div>
  );
}
