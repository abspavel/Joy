import { BlogPost } from '../types';

export interface SiteMetadataConfig {
  name: string;
  shortName: string;
  title: string;
  defaultTitle: string;
  titleTemplate: string;
  description: string;
  author: string;
  twitterHandle: string;
  locale: string;
  defaultImage: string;
  defaultImageAlt: string;
  imageDimensions: {
    width: number;
    height: number;
  };
  keywords: string[];
  baseUrl: string;
}

/**
 * Centralized Site Metadata Configuration
 */
export const SITE_METADATA_CONFIG: SiteMetadataConfig = {
  name: 'Pavel Ahmed Joy — Web Developer',
  shortName: 'Joy',
  title: 'Pavel Ahmed Joy — Web Developer | Clean, Modern, High-Performing Websites',
  defaultTitle: 'Pavel Ahmed Joy — Web Developer',
  titleTemplate: '%s | Pavel Ahmed Joy — Web Developer',
  description:
    'Portfolio of Pavel Ahmed Joy, a web developer specializing in frontend development, backend & API development, e-commerce solutions, and modern responsive web design.',
  author: 'Pavel Ahmed Joy',
  twitterHandle: '@PavelJoy',
  locale: 'en_US',
  defaultImage: '/joy-photo-transparent.png',
  defaultImageAlt: 'Pavel Ahmed Joy - Web Developer',
  imageDimensions: {
    width: 1200,
    height: 630,
  },
  keywords: [
    'Pavel Ahmed Joy',
    'Web Developer',
    'Frontend Developer',
    'React Developer',
    'Next.js',
    'Web Design',
    'E-commerce Development',
    'Backend Development',
    'Full Stack Developer',
  ],
  baseUrl: 'https://joy.dev',
};

/**
 * Helper to get the canonical base URL for the current environment
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return SITE_METADATA_CONFIG.baseUrl;
}

/**
 * Helper to ensure URLs are absolute for Open Graph crawlers
 */
export function resolveAbsoluteUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) {
    return `${getBaseUrl()}${SITE_METADATA_CONFIG.defaultImage}`;
  }
  if (
    pathOrUrl.startsWith('http://') ||
    pathOrUrl.startsWith('https://') ||
    pathOrUrl.startsWith('data:')
  ) {
    return pathOrUrl;
  }
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${getBaseUrl()}${cleanPath}`;
}

/**
 * Escapes characters for XML/SVG safety
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Splits text into lines of roughly equal character count for SVG rendering
 */
function wrapSvgText(text: string, maxCharsPerLine: number = 32, maxLines: number = 3): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      if (lines.length >= maxLines - 1) {
        break;
      }
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  // Truncate last line if more text remains
  if (lines.length === maxLines && words.length > 0) {
    const fullRendered = lines.join(' ');
    if (fullRendered.length < text.length) {
      lines[lines.length - 1] = lines[lines.length - 1].replace(/\.*$/, '') + '...';
    }
  }

  return lines.map(escapeXml);
}

export interface DynamicOgImageOptions {
  title: string;
  badge?: string;
  subtitle?: string;
  description?: string;
  author?: string;
  category?: string;
}

/**
 * Generates an SVG Data URI formatted as an Open Graph social card (1200x630)
 * Tailored to Joy's sleek dark 3D / cyber aesthetic
 */
export function generateDynamicOgImageSvg(options: DynamicOgImageOptions): string {
  const badgeText = escapeXml(options.badge || 'JOY // WEB DEVELOPER');
  const authorText = escapeXml(options.author || SITE_METADATA_CONFIG.author);
  const subtitleText = options.subtitle ? escapeXml(options.subtitle) : '';
  const descText = options.description
    ? escapeXml(options.description.slice(0, 140) + (options.description.length > 140 ? '...' : ''))
    : '';

  const titleLines = wrapSvgText(options.title, 30, 3);
  const titleYStart = titleLines.length === 1 ? 280 : titleLines.length === 2 ? 250 : 220;

  const titleSvgElements = titleLines
    .map((line, index) => {
      const y = titleYStart + index * 62;
      return `<text x="80" y="${y}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Kanit', sans-serif" font-size="52" font-weight="700" fill="#F1F5F9" letter-spacing="-0.02em">${line}</text>`;
    })
    .join('\n    ');

  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080A0E" />
      <stop offset="50%" stop-color="#0F141C" />
      <stop offset="100%" stop-color="#07090C" />
    </linearGradient>

    <!-- Glowing Accent Gradient -->
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="50%" stop-color="#818CF8" />
      <stop offset="100%" stop-color="#C084FC" />
    </linearGradient>

    <!-- Badge Gradient -->
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(56, 189, 248, 0.15)" />
      <stop offset="100%" stop-color="rgba(129, 140, 248, 0.05)" />
    </linearGradient>

    <!-- Subtle Grid Pattern -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="url(#bgGrad)" />
  <rect width="1200" height="630" fill="url(#grid)" />

  <!-- Outer Frame / Subtle Border -->
  <rect x="24" y="24" width="1152" height="582" rx="16" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1.5" />

  <!-- Decorative Corner Accents -->
  <path d="M 40 70 L 40 40 L 70 40" fill="none" stroke="#38BDF8" stroke-width="2.5" />
  <path d="M 1160 70 L 1160 40 L 1130 40" fill="none" stroke="rgba(255, 255, 255, 0.2)" stroke-width="2" />
  <path d="M 40 560 L 40 590 L 70 590" fill="none" stroke="rgba(255, 255, 255, 0.2)" stroke-width="2" />
  <path d="M 1160 560 L 1160 590 L 1130 590" fill="none" stroke="#818CF8" stroke-width="2.5" />

  <!-- Neon Top Accent Bar -->
  <rect x="80" y="80" width="120" height="4" rx="2" fill="url(#accentGrad)" />

  <!-- Badge Pill -->
  <g transform="translate(80, 110)">
    <rect width="260" height="36" rx="18" fill="url(#badgeGrad)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1" />
    <circle cx="18" cy="18" r="4" fill="#38BDF8" />
    <text x="32" y="23" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#38BDF8" letter-spacing="0.1em">${badgeText}</text>
  </g>

  <!-- Dynamic Title -->
  <g>
    ${titleSvgElements}
  </g>

  <!-- Subtitle / Excerpt -->
  ${
    descText
      ? `<text x="80" y="${titleYStart + titleLines.length * 62 + 28}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400" fill="#94A3B8" letter-spacing="0.01em">${descText}</text>`
      : ''
  }

  <!-- Footer Branding Separator -->
  <line x1="80" y1="520" x2="1120" y2="520" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />

  <!-- Footer Info -->
  <g transform="translate(80, 545)">
    <!-- Author Logo / Name -->
    <text x="0" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="#F8FAFC" letter-spacing="0.05em">${authorText}</text>
    <text x="0" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#64748B">Web Developer</text>
  </g>

  <!-- Footer Domain / Tagline -->
  <g transform="translate(1120, 545)">
    <text x="0" y="24" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" fill="#38BDF8" letter-spacing="0.04em">joy.dev</text>
    ${
      subtitleText
        ? `<text x="0" y="44" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#94A3B8">${subtitleText}</text>`
        : ''
    }
  </g>
</svg>
`.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export type PageKind = 'home' | 'blog-post' | 'blog' | 'service' | 'contact' | 'custom';

export interface MetadataInput {
  page?: PageKind;
  // Specific entity models for dynamic pages:
  post?: BlogPost | null;
  service?: any | null;
  tag?: string;

  // Custom / Overrides:
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  keywords?: string[] | string;
  type?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary_large_image' | 'summary';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  noIndex?: boolean;
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

export interface GeneratedMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  author: string;
  noIndex: boolean;
  type: 'website' | 'article' | 'profile';
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  url?: string;
  twitterCard?: 'summary_large_image' | 'summary';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  openGraph: {
    title: string;
    description: string;
    url: string;
    type: 'website' | 'article' | 'profile';
    siteName: string;
    locale: string;
    image: string;
    imageAlt: string;
    imageWidth: number;
    imageHeight: number;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
  twitter: {
    card: 'summary_large_image' | 'summary';
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    site: string;
    creator: string;
  };
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

/**
 * Formats a page title consistently with the site's brand guidelines
 */
export function formatTitle(titlePart?: string): string {
  if (!titlePart || titlePart.trim() === '') {
    return SITE_METADATA_CONFIG.title;
  }
  if (titlePart.includes('Joy')) {
    return titlePart;
  }
  return `${titlePart} | Pavel Ahmed Joy — Web Developer`;
}

/**
 * Centralized generateMetadata function.
 * Ensures each dynamic page (blog, service, etc.) has unique Open Graph tags
 * so social media previews show accurate titles, excerpts, and images.
 */
export function generateMetadata(input: MetadataInput = {}): GeneratedMetadata {
  const baseUrl = getBaseUrl();
  const author = input.author || SITE_METADATA_CONFIG.author;

  // ==========================================
  // 1. Dynamic Blog Post Page (/blog/:slug)
  // ==========================================
  if (input.page === 'blog-post' || input.post !== undefined) {
    const post = input.post;
    if (!post) {
      // 404 / Missing Article Fallback
      const title = formatTitle('Article Not Found');
      const desc = 'The requested article could not be found or has been moved.';
      const canonicalUrl = `${baseUrl}/blog`;
      const fallbackImage = resolveAbsoluteUrl(SITE_METADATA_CONFIG.defaultImage);

      return {
        title,
        description: desc,
        keywords: ['Tech Blog', 'Article', 'Joy'],
        canonicalUrl,
        author,
        noIndex: true,
        type: 'article',
        openGraph: {
          title,
          description: desc,
          url: canonicalUrl,
          type: 'article',
          siteName: SITE_METADATA_CONFIG.name,
          locale: SITE_METADATA_CONFIG.locale,
          image: fallbackImage,
          imageAlt: 'Article Not Found',
          imageWidth: SITE_METADATA_CONFIG.imageDimensions.width,
          imageHeight: SITE_METADATA_CONFIG.imageDimensions.height,
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description: desc,
          image: fallbackImage,
          imageAlt: 'Article Not Found',
          site: SITE_METADATA_CONFIG.twitterHandle,
          creator: SITE_METADATA_CONFIG.twitterHandle,
        },
      };
    }

    const postTitle = post.title.trim();
    const formattedPageTitle = formatTitle(postTitle);
    const postExcerpt = (post.excerpt || post.content || '').replace(/[\r\n#*_`>-]+/g, ' ').trim();
    const postDescription = postExcerpt.slice(0, 180) || SITE_METADATA_CONFIG.description;
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    const publishedAt = post.published_at || post.created_at;
    const modifiedAt = post.created_at || post.published_at;
    const postKeywords = Array.isArray(post.keywords) ? post.keywords : [];

    // Resolve Image: Use custom cover image if provided; otherwise generate a high-res SVG OG card
    const customImage = (post as any).cover_image_url || (post as any).image_url || input.image;
    const resolvedImage = customImage
      ? resolveAbsoluteUrl(customImage)
      : generateDynamicOgImageSvg({
          title: postTitle,
          badge: 'ARTICLE // ' + (postKeywords[0]?.toUpperCase() || 'TECH & WEB'),
          subtitle: post.read_time_minutes ? `${post.read_time_minutes} min read` : 'Technical Insight',
          description: post.excerpt,
          author,
        });

    const imageAlt = input.imageAlt || `${postTitle} - Article by Pavel Ahmed Joy`;

    return {
      title: formattedPageTitle,
      description: postDescription,
      keywords: Array.from(new Set([...postKeywords, 'Web Development', 'Frontend', 'React', 'Joy'])),
      canonicalUrl: postUrl,
      author,
      noIndex: post.published === false || input.noIndex === true,
      type: 'article',
      openGraph: {
        title: formattedPageTitle,
        description: postDescription,
        url: postUrl,
        type: 'article',
        siteName: SITE_METADATA_CONFIG.name,
        locale: SITE_METADATA_CONFIG.locale,
        image: resolvedImage,
        imageAlt,
        imageWidth: SITE_METADATA_CONFIG.imageDimensions.width,
        imageHeight: SITE_METADATA_CONFIG.imageDimensions.height,
        publishedTime: publishedAt,
        modifiedTime: modifiedAt,
        section: 'Technology & Web Development',
        tags: postKeywords,
      },
      twitter: {
        card: 'summary_large_image',
        title: formattedPageTitle,
        description: postDescription,
        image: resolvedImage,
        imageAlt,
        site: SITE_METADATA_CONFIG.twitterHandle,
        creator: SITE_METADATA_CONFIG.twitterHandle,
      },
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: postTitle,
        description: postDescription,
        datePublished: publishedAt,
        dateModified: modifiedAt,
        image: resolvedImage.startsWith('data:') ? resolveAbsoluteUrl(SITE_METADATA_CONFIG.defaultImage) : resolvedImage,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': postUrl,
        },
        author: {
          '@type': 'Person',
          name: author,
          jobTitle: 'Web Developer',
          url: baseUrl,
        },
        publisher: {
          '@type': 'Person',
          name: author,
        },
        keywords: postKeywords.join(', '),
        wordCount: (post.content || '').split(/\s+/).filter(Boolean).length,
      },
    };
  }

  // ==========================================
  // 2. Dynamic Service Detail Page (/services/:slug)
  // ==========================================
  if (input.page === 'service' || input.service !== undefined) {
    const service = input.service;
    const serviceName = service ? (service.name || service.title || 'Creative Service') : 'Creative Service';
    const formattedPageTitle = formatTitle(`${serviceName} | Web Development Solutions`);
    const serviceDescription =
      service?.description ||
      service?.detailed_content ||
      'Custom frontend development, backend APIs, e-commerce solutions, and responsive web design.';
    const serviceSlug = service?.slug || (service?.id ? service.id.toString() : 'service');
    const serviceUrl = `${baseUrl}/services/${serviceSlug}`;
    const serviceFeatures: string[] = Array.isArray(service?.features) ? service.features : [];

    // Resolve Image: Use custom service image if provided; otherwise generate high-res SVG OG card
    const customImage = service?.image_url || input.image;
    const resolvedImage = customImage
      ? resolveAbsoluteUrl(customImage)
      : generateDynamicOgImageSvg({
          title: serviceName,
          badge: `WEB SERVICE ${service?.number ? '#' + service.number : ''}`.trim(),
          subtitle: serviceFeatures.slice(0, 3).join(' • ') || 'Modern Web Solutions',
          description: serviceDescription,
          author,
        });

    const imageAlt = input.imageAlt || `${serviceName} - Web Development Service`;

    return {
      title: formattedPageTitle,
      description: serviceDescription,
      keywords: [
        serviceName,
        'Web Design Services',
        'Frontend Development',
        'Backend Solutions',
        'E-commerce Development',
        'React Developer',
        'Next.js Consulting',
        ...serviceFeatures,
      ],
      canonicalUrl: serviceUrl,
      author,
      noIndex: input.noIndex || false,
      type: 'website',
      openGraph: {
        title: formattedPageTitle,
        description: serviceDescription,
        url: serviceUrl,
        type: 'website',
        siteName: SITE_METADATA_CONFIG.name,
        locale: SITE_METADATA_CONFIG.locale,
        image: resolvedImage,
        imageAlt,
        imageWidth: SITE_METADATA_CONFIG.imageDimensions.width,
        imageHeight: SITE_METADATA_CONFIG.imageDimensions.height,
      },
      twitter: {
        card: 'summary_large_image',
        title: formattedPageTitle,
        description: serviceDescription,
        image: resolvedImage,
        imageAlt,
        site: SITE_METADATA_CONFIG.twitterHandle,
        creator: SITE_METADATA_CONFIG.twitterHandle,
      },
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: serviceName,
        description: serviceDescription,
        url: serviceUrl,
        provider: {
          '@type': 'Person',
          name: author,
          jobTitle: 'Web Developer',
          url: baseUrl,
        },
        areaServed: 'Worldwide',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${serviceName} Deliverables`,
          itemListElement: serviceFeatures.map((f: string) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: f,
            },
          })),
        },
      },
    };
  }

  // ==========================================
  // 3. Blog Listing Page (/blog or /blog?tag=...)
  // ==========================================
  if (input.page === 'blog') {
    const activeTag = input.tag;
    const pageTitle = activeTag
      ? formatTitle(`Articles tagged #${activeTag}`)
      : formatTitle('Blog & Technical Articles');

    const pageDescription = activeTag
      ? `Browse all articles, insights, and engineering tutorials tagged with #${activeTag} by Pavel Ahmed Joy.`
      : 'Technical articles, engineering insights on web development, React architecture, backend APIs, and modern frontend design by Pavel Ahmed Joy.';

    const pageUrl = activeTag
      ? `${baseUrl}/blog?tag=${encodeURIComponent(activeTag)}`
      : `${baseUrl}/blog`;

    const dynamicImage = generateDynamicOgImageSvg({
      title: activeTag ? `Articles: #${activeTag}` : 'Blog & Technical Articles',
      badge: 'JOY // ENGINEERING BLOG',
      subtitle: 'Frontend • Backend • React • Performance',
      description: pageDescription,
      author,
    });

    return {
      title: pageTitle,
      description: pageDescription,
      keywords: ['Tech Blog', 'Web Development Articles', 'React Tutorials', 'Frontend Engineering', 'Backend Development'],
      canonicalUrl: pageUrl,
      author,
      noIndex: false,
      type: 'website',
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: pageUrl,
        type: 'website',
        siteName: SITE_METADATA_CONFIG.name,
        locale: SITE_METADATA_CONFIG.locale,
        image: dynamicImage,
        imageAlt: pageTitle,
        imageWidth: SITE_METADATA_CONFIG.imageDimensions.width,
        imageHeight: SITE_METADATA_CONFIG.imageDimensions.height,
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: pageDescription,
        image: dynamicImage,
        imageAlt: pageTitle,
        site: SITE_METADATA_CONFIG.twitterHandle,
        creator: SITE_METADATA_CONFIG.twitterHandle,
      },
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Pavel Ahmed Joy Engineering Blog',
        description: pageDescription,
        url: `${baseUrl}/blog`,
        author: {
          '@type': 'Person',
          name: author,
          jobTitle: 'Web Developer',
        },
      },
    };
  }

  // ==========================================
  // 4. Contact Page (/contact)
  // ==========================================
  if (input.page === 'contact') {
    const pageTitle = formatTitle('Contact & Collaboration');
    const pageDescription =
      'Get in touch with Pavel Ahmed Joy for freelance web development, frontend engineering, backend APIs, or e-commerce solutions.';
    const pageUrl = `${baseUrl}/contact`;
    const dynamicImage = generateDynamicOgImageSvg({
      title: 'Contact & Collaboration',
      badge: 'LET\'S BUILD TOGETHER',
      subtitle: 'Freelance Web Developer • Full Stack Solutions',
      description: pageDescription,
      author,
    });

    return {
      title: pageTitle,
      description: pageDescription,
      keywords: [
        'Contact Joy',
        'Hire Web Developer',
        'Freelance React Developer',
        'Web Development Inquiries',
        'Pavel Ahmed Joy Contact',
      ],
      canonicalUrl: pageUrl,
      author,
      noIndex: false,
      type: 'website',
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: pageUrl,
        type: 'website',
        siteName: SITE_METADATA_CONFIG.name,
        locale: SITE_METADATA_CONFIG.locale,
        image: dynamicImage,
        imageAlt: pageTitle,
        imageWidth: SITE_METADATA_CONFIG.imageDimensions.width,
        imageHeight: SITE_METADATA_CONFIG.imageDimensions.height,
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: pageDescription,
        image: dynamicImage,
        imageAlt: pageTitle,
        site: SITE_METADATA_CONFIG.twitterHandle,
        creator: SITE_METADATA_CONFIG.twitterHandle,
      },
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: pageTitle,
        description: pageDescription,
        mainEntity: {
          '@type': 'Person',
          name: author,
          jobTitle: 'Web Developer',
          email: 'abspavel126@gmail.com',
        },
      },
    };
  }

  // ==========================================
  // 5. Default / Homepage / Custom Page
  // ==========================================
  const pageTitle = input.title ? formatTitle(input.title) : SITE_METADATA_CONFIG.title;
  const pageDescription = input.description || SITE_METADATA_CONFIG.description;
  const pageUrl = input.url || `${baseUrl}/`;
  const resolvedImage = input.image
    ? resolveAbsoluteUrl(input.image)
    : resolveAbsoluteUrl(SITE_METADATA_CONFIG.defaultImage);
  const imageAlt = input.imageAlt || SITE_METADATA_CONFIG.defaultImageAlt;
  const keywords = Array.isArray(input.keywords)
    ? input.keywords
    : typeof input.keywords === 'string'
      ? input.keywords.split(',').map((k) => k.trim())
      : SITE_METADATA_CONFIG.keywords;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords,
    canonicalUrl: pageUrl,
    author,
    noIndex: input.noIndex || false,
    type: input.type || 'website',
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      type: input.type || 'website',
      siteName: SITE_METADATA_CONFIG.name,
      locale: SITE_METADATA_CONFIG.locale,
      image: resolvedImage,
      imageAlt,
      imageWidth: SITE_METADATA_CONFIG.imageDimensions.width,
      imageHeight: SITE_METADATA_CONFIG.imageDimensions.height,
      publishedTime: input.publishedTime,
      modifiedTime: input.modifiedTime,
      section: input.section,
    },
    twitter: {
      card: input.twitterCard || 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      image: resolvedImage,
      imageAlt,
      site: SITE_METADATA_CONFIG.twitterHandle,
      creator: SITE_METADATA_CONFIG.twitterHandle,
    },
    structuredData: input.structuredData,
  };
}

// Convenience sub-methods attached to generateMetadata
generateMetadata.blog = (post: BlogPost | null, options?: Partial<MetadataInput>): GeneratedMetadata => {
  return generateMetadata({ page: 'blog-post', post, ...options });
};

generateMetadata.service = (service: any | null, options?: Partial<MetadataInput>): GeneratedMetadata => {
  return generateMetadata({ page: 'service', service, ...options });
};

generateMetadata.listing = (tag?: string, options?: Partial<MetadataInput>): GeneratedMetadata => {
  return generateMetadata({ page: 'blog', tag, ...options });
};

generateMetadata.contact = (options?: Partial<MetadataInput>): GeneratedMetadata => {
  return generateMetadata({ page: 'contact', ...options });
};

generateMetadata.home = (options?: Partial<MetadataInput>): GeneratedMetadata => {
  return generateMetadata({ page: 'home', ...options });
};
