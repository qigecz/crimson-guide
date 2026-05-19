import { useState, useMemo } from 'react';

interface Props {
  url: string;
  title?: string;
}

export default function VideoEmbed({ url, title }: Props) {
  const embedUrl = useMemo(() => {
    // YouTube: youtube.com/watch?v=xxx or youtu.be/xxx
    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

    // Bilibili: bilibili.com/video/BVxxx
    const biliMatch = url.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/);
    if (biliMatch) return `https://player.bilibili.com/player.html?bvid=${biliMatch[1]}&autoplay=0`;

    return url;
  }, [url]);

  return (
    <div className="my-6">
      <div className="aspect-video rounded-lg overflow-hidden shadow-md bg-surface-100 dark:bg-surface-800">
        <iframe
          src={embedUrl}
          title={title || 'Embedded video'}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
