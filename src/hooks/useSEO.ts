import { useEffect } from 'react';
import { GeneratedMetadata, MetadataInput, generateMetadata } from '../utils/metadata';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string | string[];
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary_large_image' | 'summary';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  structuredData?: Record<string, any> | Array<Record<string, any>>;
  noIndex?: boolean;
  // Support passing GeneratedMetadata directly
  openGraph?: GeneratedMetadata['openGraph'];
  twitter?: GeneratedMetadata['twitter'];
  canonicalUrl?: string;
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

export function useSEO(props: SEOProps | GeneratedMetadata) {
  // Normalize properties whether passed as SEOProps or GeneratedMetadata
  const og = 'openGraph' in props ? props.openGraph : undefined;
  const tw = 'twitter' in props ? props.twitter : undefined;

  const title = og?.title || props.title || 'Pavel Ahmed Joy — Web Developer | Clean, Modern, High-Performing Websites';
  const description = og?.description || props.description;
  const keywords = props.keywords;
  const image = og?.image || props.image;
  const imageAlt = og?.imageAlt || props.imageAlt;
  const imageWidth = og?.imageWidth || props.imageWidth || 1200;
  const imageHeight = og?.imageHeight || props.imageHeight || 630;
  const url = ('canonicalUrl' in props ? props.canonicalUrl : undefined) || og?.url || props.url;
  const type = og?.type || props.type || 'website';
  const twitterCard = tw?.card || props.twitterCard || 'summary_large_image';
  const author = props.author || 'Pavel Ahmed Joy';
  const publishedTime = og?.publishedTime || props.publishedTime;
  const modifiedTime = og?.modifiedTime || props.modifiedTime;
  const section = og?.section || props.section;
  const tags = og?.tags || props.tags;
  const structuredData = props.structuredData;
  const noIndex = props.noIndex || false;

  useEffect(() => {
    // 1. Document Title
    const formattedTitle = title.includes('Joy') ? title : `${title} | Pavel Ahmed Joy — Web Developer`;
    document.title = formattedTitle;
    updateMetaTag('meta[name="title"]', 'name', 'title', 'content', formattedTitle);

    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    
    let resolvedImage = `${origin}/joy-photo-transparent.png`;
    if (image) {
      if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) {
        resolvedImage = image;
      } else {
        resolvedImage = `${origin}${image.startsWith('/') ? '' : '/'}${image}`;
      }
    }

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
    if (currentUrl) {
      updateMetaTag('link[rel="canonical"]', 'rel', 'canonical', 'href', currentUrl);
    }

    // 3. Open Graph Tags
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', 'content', formattedTitle);
    if (description) {
      updateMetaTag('meta[property="og:description"]', 'property', 'og:description', 'content', description);
    }
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', 'content', type);
    if (currentUrl) {
      updateMetaTag('meta[property="og:url"]', 'property', 'og:url', 'content', currentUrl);
    }
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', 'content', resolvedImage);
    updateMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', 'content', imageAlt || formattedTitle);
    updateMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', 'content', String(imageWidth));
    updateMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', 'content', String(imageHeight));
    updateMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'content', 'Pavel Ahmed Joy — Web Developer');
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
    if (tags && Array.isArray(tags) && tags.length > 0) {
      updateMetaTag('meta[property="article:tag"]', 'property', 'article:tag', 'content', tags.join(', '));
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
    imageWidth,
    imageHeight,
    url,
    type,
    twitterCard,
    author,
    publishedTime,
    modifiedTime,
    section,
    tags,
    structuredData,
    noIndex,
  ]);
}

/**
 * Hook to directly pass MetadataInput or GeneratedMetadata
 */
export function usePageMetadata(input: MetadataInput | GeneratedMetadata) {
  const metadata = 'openGraph' in input ? input : generateMetadata(input);
  useSEO(metadata);
  return metadata;
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
