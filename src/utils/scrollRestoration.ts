/**
 * Utility to manage instant scroll restoration between Homepage and Service Detail Pages.
 * Ensures zero flash of top (Hero) and zero visible scroll animations when navigating back.
 */

export const HOMEPAGE_SCROLL_KEY = 'homepageScrollPosition';
export const FROM_SERVICE_KEY = 'fromServiceDetailPage';

/**
 * Saves current scroll position before navigating to a service detail page.
 */
export function saveHomepageScrollPosition() {
  if (typeof window === 'undefined') return;
  const currentY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
  sessionStorage.setItem(HOMEPAGE_SCROLL_KEY, currentY.toString());
  sessionStorage.setItem(FROM_SERVICE_KEY, 'true');
}

/**
 * Gets saved homepage scroll position if it exists.
 */
export function getSavedHomepageScrollPosition(): number | null {
  if (typeof window === 'undefined') return null;
  const val = sessionStorage.getItem(HOMEPAGE_SCROLL_KEY);
  if (!val) return null;
  const num = parseInt(val, 10);
  return isNaN(num) ? null : num;
}

/**
 * Checks if the user is returning from a service detail page.
 */
export function isReturningFromService(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(FROM_SERVICE_KEY) === 'true' && sessionStorage.getItem(HOMEPAGE_SCROLL_KEY) !== null;
}

/**
 * Instantly restores scroll position with zero animation and syncs with Lenis.
 */
export function restoreInstantScroll(targetY: number): void {
  if (typeof window === 'undefined') return;

  // Instant scroll on window & document elements
  window.scrollTo({
    top: targetY,
    left: 0,
    behavior: 'instant' as ScrollBehavior,
  });
  
  if (document.documentElement) {
    document.documentElement.scrollTop = targetY;
  }
  if (document.body) {
    document.body.scrollTop = targetY;
  }

  // Sync with Lenis smooth scroll if initialized
  const lenis = (window as any).__lenis;
  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(targetY, { immediate: true, force: true });
  }
}

/**
 * Clears saved homepage scroll position and flags.
 */
export function clearHomepageScrollPosition(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(HOMEPAGE_SCROLL_KEY);
  sessionStorage.removeItem(FROM_SERVICE_KEY);
}
