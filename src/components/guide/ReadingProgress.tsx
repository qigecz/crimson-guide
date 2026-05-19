import { useState, useEffect, useRef } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('.prose');
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const scrollPos = window.scrollY + window.innerHeight * 0.3; // 30% viewport offset
      const articleEnd = articleTop + articleHeight;

      const pct = Math.min(
        Math.max((scrollPos - articleTop) / (articleEnd - articleTop), 0),
        1
      );
      setProgress(pct);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-surface-200 dark:bg-surface-800">
      <div
        className="h-full bg-primary-500 transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
