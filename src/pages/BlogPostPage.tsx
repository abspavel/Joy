import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import { Navbar } from '../components/Navbar';
import { FooterSection } from '../sections/FooterSection';
import { FadeIn } from '../components/FadeIn';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useSEO } from '../hooks/useSEO';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  Check, 
  Copy, 
  Twitter, 
  Linkedin, 
  ArrowRight,
  BookOpen,
  User
} from 'lucide-react';
import { BlogPost } from '../types';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const { data: rawPosts, loading } = usePortfolioData('blog_posts');

  const publishedPosts: BlogPost[] = useMemo(() => {
    return (rawPosts || [])
      .filter((post: BlogPost) => post.published !== false)
      .sort((a: BlogPost, b: BlogPost) => {
        const timeA = new Date(a.published_at || a.created_at).getTime();
        const timeB = new Date(b.published_at || b.created_at).getTime();
        return timeB - timeA;
      });
  }, [rawPosts]);

  // Find the post matching the current slug
  const postIndex = publishedPosts.findIndex(p => p.slug === slug);
  const post = postIndex !== -1 ? publishedPosts[postIndex] : null;

  // Previous and next posts for bottom navigation
  const prevPost = postIndex > 0 ? publishedPosts[postIndex - 1] : null;
  const nextPost = postIndex !== -1 && postIndex < publishedPosts.length - 1 ? publishedPosts[postIndex + 1] : null;

  const formattedDate = post ? new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : '';

  const wordCount = useMemo(() => {
    if (!post?.content) return 0;
    return post.content.split(/\s+/).filter(Boolean).length;
  }, [post?.content]);

  const readTime = post?.read_time_minutes || Math.max(1, Math.ceil(wordCount / 200));

  const postUrl = typeof window !== 'undefined' ? window.location.href : `https://joy.dev/blog/${slug}`;

  // SEO configuration with Article / BlogPosting JSON-LD
  useSEO({
    title: post ? `${post.title} | Joy -- 3D Creator & Frontend Developer` : 'Article Not Found | Joy',
    description: post?.excerpt || 'Read technical articles and insights by Pavel Ahmed Joy.',
    keywords: post?.keywords || ['3D Web Development', 'Frontend', 'Creative Tech'],
    type: 'article',
    twitterCard: 'summary',
    author: 'Pavel Ahmed Joy',
    publishedTime: post?.published_at || post?.created_at,
    modifiedTime: post?.created_at,
    section: 'Technology & Web Development',
    url: postUrl,
    structuredData: post ? {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': post.title,
      'description': post.excerpt || post.title,
      'datePublished': post.published_at || post.created_at,
      'dateModified': post.created_at || post.published_at,
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': postUrl
      },
      'author': {
        '@type': 'Person',
        'name': 'Pavel Ahmed Joy',
        'jobTitle': '3D Creator & Frontend Developer',
        'url': typeof window !== 'undefined' ? window.location.origin : 'https://joy.dev'
      },
      'publisher': {
        '@type': 'Person',
        'name': 'Pavel Ahmed Joy'
      },
      'keywords': post.keywords ? post.keywords.join(', ') : '',
      'wordCount': wordCount
    } : undefined
  });

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`"${post?.title}" by @PavelJoy`);
    const shareUrl = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank', 'noopener,noreferrer');
  };

  // Loading state
  if (loading && !post) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-5 py-24 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-[var(--text-primary)]/50">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--text-primary)] border-t-transparent animate-spin" />
            <p className="text-sm font-mono">Loading article...</p>
          </div>
        </main>
        <FooterSection />
      </div>
    );
  }

  // Not found state
  if (!post) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto w-full px-5 py-24 text-center flex flex-col items-center justify-center">
          <BookOpen className="w-12 h-12 text-[var(--text-primary)]/30 mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">Article Not Found</h1>
          <p className="text-[var(--text-primary)]/60 text-sm sm:text-base mb-8 max-w-md">
            The article you are looking for might have been unpublished, renamed, or does not exist.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Articles</span>
          </Link>
        </main>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col selection:bg-[var(--text-highlight)] selection:text-[var(--bg-primary)]">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 sm:px-8 md:px-10 pt-12 sm:pt-16 md:pt-20 pb-20 sm:pb-28">
        {/* Navigation Breadcrumb */}
        <FadeIn delay={0} y={15} className="mb-8 sm:mb-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[var(--text-primary)]/60 hover:text-[var(--text-primary)] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Articles</span>
          </Link>
        </FadeIn>

        {/* Article Header */}
        <header className="mb-10 sm:mb-14 pb-8 sm:pb-10 border-b border-[var(--text-primary)]/15">
          {/* Metadata Row */}
          <FadeIn delay={0.05} y={15} className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-[var(--text-primary)]/50 tracking-wider mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 opacity-70" />
              {formattedDate}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--text-primary)]/30" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 opacity-70" />
              {readTime} min read ({wordCount} words)
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--text-primary)]/30" />
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 opacity-70" />
              Pavel Ahmed Joy
            </span>
          </FadeIn>

          {/* Article Title */}
          <FadeIn delay={0.1} y={20}>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-medium text-[#D7E2EA] tracking-tight leading-[1.2] mb-6">
              {post.title}
            </h1>
          </FadeIn>

          {/* Excerpt Callout */}
          {post.excerpt && (
            <FadeIn delay={0.15} y={20}>
              <div className="rounded-xl border border-[#D7E2EA]/15 bg-[var(--bg-secondary)] p-4 sm:p-6 text-sm sm:text-base md:text-lg text-[var(--text-primary)]/80 font-light leading-relaxed italic">
                "{post.excerpt}"
              </div>
            </FadeIn>
          )}
        </header>

        {/* Article Body (Markdown rendered strictly without images) */}
        <FadeIn delay={0.2} y={25} className="mb-14 sm:mb-18">
          <div className="markdown-body max-w-none text-left">
            <Markdown
              components={{
                // Explicitly disable images to strictly obey "No images anywhere in the blog"
                img: () => null,
                h1: ({ children }) => (
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#D7E2EA] mt-10 mb-4 tracking-tight leading-tight">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#D7E2EA] mt-8 mb-4 tracking-tight leading-snug border-b border-[var(--text-primary)]/10 pb-2">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-[#D7E2EA] mt-6 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-base sm:text-lg text-[var(--text-primary)]/85 leading-relaxed mb-6 font-light">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-outside pl-6 mb-6 space-y-2 text-[var(--text-primary)]/85 leading-relaxed">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-outside pl-6 mb-6 space-y-2 text-[var(--text-primary)]/85 leading-relaxed">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-base sm:text-lg pl-1">
                    {children}
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[var(--text-highlight)] bg-[var(--bg-secondary)]/50 rounded-r-lg py-3 px-4 sm:px-6 my-6 italic text-[var(--text-primary)]/75">
                    {children}
                  </blockquote>
                ),
                code: ({ className, children }) => {
                  return (
                    <code className="bg-[var(--bg-secondary)] border border-[var(--text-primary)]/15 px-1.5 py-0.5 rounded text-sm font-mono text-[var(--text-highlight)]">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-[var(--bg-secondary)] border border-[var(--text-primary)]/15 p-4 sm:p-5 rounded-xl overflow-x-auto my-6 font-mono text-sm text-[var(--text-primary)]/90 custom-scrollbar">
                    {children}
                  </pre>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-[#D7E2EA]">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-[var(--text-primary)]">
                    {children}
                  </em>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-[var(--text-highlight)] underline underline-offset-4 hover:opacity-80 transition-opacity"
                  >
                    {children}
                  </a>
                ),
                hr: () => (
                  <hr className="border-[var(--text-primary)]/15 my-10" />
                )
              }}
            >
              {post.content}
            </Markdown>
          </div>
        </FadeIn>

        {/* Tags / Keywords Section */}
        {post.keywords && post.keywords.length > 0 && (
          <FadeIn delay={0.25} y={20} className="mb-10 pt-8 border-t border-[var(--text-primary)]/15">
            <h4 className="text-xs uppercase tracking-widest text-[var(--text-primary)]/50 font-mono mb-3">
              Tags &amp; Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {post.keywords.map((kw) => {
                const clean = kw.replace(/^#/, '').trim();
                if (!clean) return null;
                return (
                  <Link
                    key={clean}
                    to={`/blog?tag=${encodeURIComponent(clean)}`}
                    className="px-3 py-1 rounded-full border border-[#D7E2EA]/20 bg-[var(--bg-secondary)] text-xs text-[var(--text-primary)]/80 hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]/60 hover:bg-[var(--text-primary)]/10 transition-colors"
                  >
                    #{clean}
                  </Link>
                );
              })}
            </div>
          </FadeIn>
        )}

        {/* Share & Feedback Bar */}
        <FadeIn delay={0.3} y={20} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-xl border border-[var(--text-primary)]/15 bg-[var(--bg-secondary)] mb-14">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
            <Share2 className="w-4 h-4 text-[var(--text-primary)]/60" />
            <span>Share this article</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--text-primary)]/20 hover:border-[var(--text-primary)]/50 bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied URL!' : 'Copy Link'}</span>
            </button>
            <button
              type="button"
              onClick={handleShareTwitter}
              aria-label="Share on Twitter"
              className="p-2 rounded-lg border border-[var(--text-primary)]/20 hover:border-[var(--text-primary)]/50 bg-[var(--bg-primary)] text-[var(--text-primary)]/70 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <Twitter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleShareLinkedIn}
              aria-label="Share on LinkedIn"
              className="p-2 rounded-lg border border-[var(--text-primary)]/20 hover:border-[var(--text-primary)]/50 bg-[var(--bg-primary)] text-[var(--text-primary)]/70 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </button>
          </div>
        </FadeIn>

        {/* Next / Previous Article Navigation */}
        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[var(--text-primary)]/15">
          {prevPost ? (
            <Link
              to={`/blog/${prevPost.slug}`}
              className="group flex flex-col p-4 rounded-xl border border-[var(--text-primary)]/15 bg-[var(--bg-secondary)]/50 hover:border-[var(--text-primary)]/40 hover:bg-[var(--bg-secondary)] transition-all text-left"
            >
              <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[var(--text-primary)]/50 font-mono mb-1">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> Previous
              </span>
              <span className="text-sm font-medium text-[#D7E2EA] group-hover:text-[var(--text-highlight)] transition-colors line-clamp-1">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextPost ? (
            <Link
              to={`/blog/${nextPost.slug}`}
              className="group flex flex-col p-4 rounded-xl border border-[var(--text-primary)]/15 bg-[var(--bg-secondary)]/50 hover:border-[var(--text-primary)]/40 hover:bg-[var(--bg-secondary)] transition-all text-right sm:text-right"
            >
              <span className="inline-flex items-center justify-end gap-1 text-[11px] uppercase tracking-wider text-[var(--text-primary)]/50 font-mono mb-1">
                Next <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <span className="text-sm font-medium text-[#D7E2EA] group-hover:text-[var(--text-highlight)] transition-colors line-clamp-1">
                {nextPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </main>

      <FooterSection />
    </div>
  );
}
