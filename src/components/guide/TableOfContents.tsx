import { useState, useEffect, useRef } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const proseEl = document.querySelector('.prose');
    if (!proseEl) return;

    const elements = proseEl.querySelectorAll('h2, h3');
    const headingData: Heading[] = Array.from(elements).map((el) => ({
      id: el.id,
      text: el.textContent || '',
      level: parseInt(el.tagName[1]),
    }));
    setHeadings(headingData);

    // Add IDs to headings that don't have them
    elements.forEach((el) => {
      if (!el.id) {
        el.id = el.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || '';
      }
    });

    // IntersectionObserver to track active heading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  if (headings.length === 0) return null;

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="space-y-1">
      <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-3">
        On this page
      </h4>
      {headings.map((heading) => (
        <button
          key={heading.id}
          onClick={() => handleClick(heading.id)}
          className={`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
            heading.level === 3 ? 'pl-5' : ''
          } ${
            activeId === heading.id
              ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 font-medium'
              : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
          }`}
        >
          {heading.text}
        </button>
      ))}
    </nav>
  );
}
