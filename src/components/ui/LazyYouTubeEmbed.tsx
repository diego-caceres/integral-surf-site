"use client";

import { useState, useRef, useEffect } from "react";

interface LazyYouTubeEmbedProps {
  src: string;
  title: string;
}

export default function LazyYouTubeEmbed({ src, title }: LazyYouTubeEmbedProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative w-full aspect-video overflow-hidden rounded-xl bg-black/20">
      {visible && (
        <iframe
          className="absolute top-0 left-0 w-full h-full border-0"
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}
    </div>
  );
}
