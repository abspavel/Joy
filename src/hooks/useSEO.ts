import { useEffect } from 'react';

export function useSEO({
  title,
  description,
  url = window.location.href,
  image,
}: {
  title: string;
  description?: string;
  url?: string;
  image?: string;
}) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        metaDescription.setAttribute('content', description);
        document.head.appendChild(metaDescription);
      }

      // Open Graph Description
      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', description);
      } else {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        ogDescription.setAttribute('content', description);
        document.head.appendChild(ogDescription);
      }
    }

    // Update Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    } else {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.setAttribute('content', title);
      document.head.appendChild(ogTitle);
    }

    // Update Open Graph URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', url);
    } else {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      ogUrl.setAttribute('content', url);
      document.head.appendChild(ogUrl);
    }

    if (image) {
      // Open Graph Image
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', image);
      } else {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        ogImage.setAttribute('content', image);
        document.head.appendChild(ogImage);
      }

      // Twitter Card Image
      let twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (twitterImage) {
        twitterImage.setAttribute('content', image);
      } else {
        twitterImage = document.createElement('meta');
        twitterImage.setAttribute('name', 'twitter:image');
        twitterImage.setAttribute('content', image);
        document.head.appendChild(twitterImage);
      }
      
      // Twitter Card Type
      let twitterCard = document.querySelector('meta[name="twitter:card"]');
      if (!twitterCard) {
        twitterCard = document.createElement('meta');
        twitterCard.setAttribute('name', 'twitter:card');
        twitterCard.setAttribute('content', 'summary_large_image');
        document.head.appendChild(twitterCard);
      }
    } else {
      // Clean up if no image is provided for the current route/view
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) document.head.removeChild(ogImage);
      
      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (twitterImage) document.head.removeChild(twitterImage);
    }
  }, [title, description, url, image]);
}
