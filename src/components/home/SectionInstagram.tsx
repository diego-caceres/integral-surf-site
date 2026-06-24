"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { InstagramPost } from "../../types/instagramPost";

export default function SectionInstagram() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);

  useEffect(() => {
    fetch("/api/instagram-posts")
      .then((res) => (res.ok ? res.json() : []))
      // The API returns an error object on failure — only ever store an array
      // so a degraded response can't crash the render with `posts.map`.
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="instagram-heading" className="w-full py-6 px-4">
      <h2 id="instagram-heading" className="font-[Eckmannpsych] text-center mb-2">
        Síguenos
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {posts.map((post, index) => (
          <a
            key={post.id}
            href={post.post_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ver post de Instagram ${index + 1}`}
          >
            <div className="relative w-full aspect-square">
              <Image
                src={post.image_url}
                alt={`Post de Instagram ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg hover:opacity-80 transition-opacity"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
