import { useState, useEffect, useRef, useCallback } from 'react';

interface SearchItem {
  url: string;
  title: string;
  content: string;
}

export default function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load Pagefind
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    // @ts-ignore — pagefind is loaded at runtime
    const pf = window.pagefind;
    if (!pf) {
      setResults([]);
      return;
    }
    const searchResult = await pf.search(q);
    const items = await Promise.all(
      searchResult.results.slice(0, 8).map((r: any) => r.data())
    );
    setResults(
      items.map((item: any) => ({
        url: item.url,
        title: item.meta?.title || 'Untitled',
        content: item.excerpt || '',
      }))
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 200);
    return () => clearTimeout(timer);
  }, [query, search]);

  // Init pagefind dynamically at runtime
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // @ts-ignore
    if (window.pagefind) return;

    const script = document.createElement('script');
    script.src = '/pagefind/pagefind.js';
    script.onload = () => {
      // @ts-ignore
      window.pagefind?.init();
    };
    document.head.appendChild(script);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      onClick={() => setIsOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className="relative w-full max-w-lg mx-4 bg-white dark:bg-surface-900 rounded-xl shadow-2xl border border-surface-200 dark:border-surface-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-200 dark:border-surface-700">
          <svg className="w-5 h-5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides..."
            className="flex-1 bg-transparent text-surface-900 dark:text-surface-100 placeholder-surface-400 outline-none text-base"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-surface-400 bg-surface-100 dark:bg-surface-800 rounded border border-surface-200 dark:border-surface-700">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <ul className="max-h-80 overflow-y-auto py-2">
            {results.map((result) => (
              <li key={result.url}>
                <a
                  href={result.url}
                  className="block px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <p className="text-sm font-medium text-surface-900 dark:text-surface-100 mb-0.5">
                    {result.title}
                  </p>
                  <p
                    className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: result.content }}
                  />
                </a>
              </li>
            ))}
          </ul>
        ) : query ? (
          <div className="px-4 py-8 text-center text-surface-400 text-sm">
            No results found.
          </div>
        ) : (
          <div className="px-4 py-8 text-center text-surface-400 text-sm">
            Type to search guides...
          </div>
        )}
      </div>
    </div>
  );
}

// Extend window for pagefind
declare global {
  interface Window {
    pagefind?: {
      init: () => void;
      search: (query: string) => Promise<{ results: Array<{ data: () => Promise<any> }> }>;
    };
  }
}
