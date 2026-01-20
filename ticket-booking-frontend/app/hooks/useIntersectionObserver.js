import { useEffect, useRef, useState } from 'react';

export default function useIntersectionObserver(options = {}) {
  const { threshold = 0.15, root = null, rootMargin = '0px' } = options;
  const ref = useRef(null);
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver((entries) => {
      if (entries && entries.length > 0) {
        setEntry(entries[0]);
      }
    }, { threshold, root, rootMargin });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin]);

  return {
    ref,
    entry,
    isIntersecting: Boolean(entry?.isIntersecting),
  };
}
