import { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description?: string;
  keywords?: string | string[];
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary_large_image' | 'summary';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  structuredData?: Record<string, any> | Array<Record<string, any>>;
  noIndex?: boolean;
}

function updateMetaTag(
  selector: string,
  attributeName: string,
  attributeValue: string,
  contentKey: 'content' | 'href',
  contentValue: string
) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute(contentKey, contentValue);
}

export function useSEO({
  title,
  description,
  keywords,
  image,
  imageAlt,
  url,
  type = 'website',
  twitterCard = 'summary_large_image',
  author = 'Pavel Ahmed Joy',
  publishedTime,
  modifiedTime,
  section,
  structuredData,
  noIndex = false,
}: SEOProps) {
  useEffect(() => {
    // 1. Document Title
    const formattedTitle = title.includes('Joy') ? title : `${title} | Joy -- 3D Creator`;
    document.title = formattedTitle;

    const currentUrl = url || window.location.href;
    const resolvedImage = image ? (image.startsWith('http') ? image : `${window.location.origin}${image.startsWith('/') ? '' : '/'}${image}`) : `${window.location.origin}/joy-photo-transparent.png`;
    const resolvedKeywords = Array.isArray(keywords) ? keywords.join(', ') : keywords;

    // 2. Standard Meta Tags
    if (description) {
      updateMetaTag('meta[name="description"]', 'name', 'description', 'content', description);
    }
    if (resolvedKeywords) {
      updateMetaTag('meta[name="keywords"]', 'name', 'keywords', 'content', resolvedKeywords);
    }
    if (author) {
      updateMetaTag('meta[name="author"]', 'name', 'author', 'content', author);
    }

    // Robots Tag
    updateMetaTag(
      'meta[name="robots"]',
      'name',
      'robots',
      'content',
      noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1'
    );

    // Canonical Link
    updateMetaTag('link[rel="canonical"]', 'rel', 'canonical', 'href', currentUrl);

    // 3. Open Graph Tags
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', 'content', formattedTitle);
    if (description) {
      updateMetaTag('meta[property="og:description"]', 'property', 'og:description', 'content', description);
    }
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', 'content', type);
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', 'content', currentUrl);
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', 'content', resolvedImage);
    updateMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', 'content', imageAlt || formattedTitle);
    updateMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'content', 'Joy -- 3D Creator & Frontend Developer');
    updateMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'content', 'en_US');

    if (publishedTime) {
      updateMetaTag('meta[property="article:published_time"]', 'property', 'article:published_time', 'content', publishedTime);
    }
    if (modifiedTime) {
      updateMetaTag('meta[property="article:modified_time"]', 'property', 'article:modified_time', 'content', modifiedTime);
    }
    if (section) {
      updateMetaTag('meta[property="article:section"]', 'property', 'article:section', 'content', section);
    }

    // 4. Twitter Card Tags
    updateMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'content', twitterCard);
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', 'content', formattedTitle);
    if (description) {
      updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', 'content', description);
    }
    updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', 'content', resolvedImage);
    updateMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', 'content', imageAlt || formattedTitle);
    updateMetaTag('meta[name="twitter:site"]', 'name', 'twitter:site', 'content', '@PavelJoy');
    updateMetaTag('meta[name="twitter:creator"]', 'name', 'twitter:creator', 'content', '@PavelJoy');

    // 5. Dynamic JSON-LD Structured Data
    const scriptId = 'dynamic-seo-jsonld';
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (structuredData) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = scriptId;
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(structuredData);
    } else if (scriptElement) {
      scriptElement.remove();
    }
  }, [
    title,
    description,
    keywords,
    image,
    imageAlt,
    url,
    type,
    twitterCard,
    author,
    publishedTime,
    modifiedTime,
    section,
    structuredData,
    noIndex,
  ]);
}

export interface SectionMetaConfig {
  id: string;
  title: string;
  description: string;
  keywords?: string[];
  sectionName?: string;
}

/**
 * Hook to dynamically update meta tags as sections enter viewport
 */
export function useSectionViewportSEO(sections: SectionMetaConfig[], enabled: boolean = true) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    let activeSectionId = '';

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible entry with highest intersection ratio
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) return;

        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const topEntry = visibleEntries[0];
        const targetId = topEntry.target.id;

        if (targetId && targetId !== activeSectionId) {
          activeSectionId = targetId;
          const config = sections.find((s) => s.id === targetId);
          if (config) {
            // Update document title and primary meta tags dynamically
            document.title = config.title;

            updateMetaTag('meta[name="description"]', 'name', 'description', 'content', config.description);
            updateMetaTag('meta[property="og:title"]', 'property', 'og:title', 'content', config.title);
            updateMetaTag('meta[property="og:description"]', 'property', 'og:description', 'content', config.description);
            updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', 'content', config.title);
            updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', 'content', config.description);

            if (config.keywords && config.keywords.length > 0) {
              updateMetaTag('meta[name="keywords"]', 'name', 'keywords', 'content', config.keywords.join(', '));
            }
          }
        }
      },
      {
        rootMargin: '-20% 0px -40% 0px',
        threshold: [0.1, 0.3, 0.6],
      }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sections, enabled]);
}
