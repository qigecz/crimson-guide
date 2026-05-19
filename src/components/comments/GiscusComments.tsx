import { useEffect, useRef } from 'react';
import Giscus from '@giscus/react';

interface Props {
  lang: string;
}

export default function GiscusComments({ lang }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Watch for theme changes
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      const iframe = containerRef.current?.querySelector('iframe');
      if (iframe) {
        iframe.contentWindow?.postMessage(
          { giscus: { setConfig: { theme: isDark ? 'dark' : 'light' } } },
          'https://giscus.app'
        );
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="mt-8">
      <Giscus
        repo="crimsonsguide/crimsonsguide.github.io"
        repoId=""
        category="General"
        categoryId=""
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
        lang={lang === 'zh-cn' ? 'zh-CN' : lang}
        loading="lazy"
      />
    </div>
  );
}
