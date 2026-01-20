import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook that observes when an element enters the viewport
 * and applies an animation class when visible
 * 
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Intersection threshold (0-1)
 * @param {string} options.rootMargin - Margin around the root
 * @returns {Object} - { ref, isVisible }
 */
export function useIntersectionObserver(options = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px' } = options;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true); // Fallback for SSR or unsupported browsers
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
        // Unobserve after first trigger (one-time reveal)
        observer.unobserve(entry.target);
      }
    }, {
      threshold,
      rootMargin,
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, isVisible]);

  return { ref, isVisible };
}
