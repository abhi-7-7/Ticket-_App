import { useEffect, useState } from 'react';
import useIntersectionObserver from './useIntersectionObserver';

export default function useScrollReveal(options = {}) {
  const { ref, isIntersecting } = useIntersectionObserver(options);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    if (isIntersecting) {
      setHasRevealed(true);
    }
  }, [isIntersecting]);

  return {
    ref,
    isVisible: hasRevealed,
  };
}
