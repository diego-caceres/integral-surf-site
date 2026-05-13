"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { InstagramPost } from "../../types/instagramPost";

export default function SectionInstagram() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);

  useEffect(() => {
    fetch("/api/instagram-posts")
      .then((res) => res.json())
      .then((data: InstagramPost[]) => setPosts(data))
      .catch(() => {});
  }, []);

  if (posts.length === 0) return null;

  return (
    <div className="w-full p-4">
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
    </div>
  );
}
