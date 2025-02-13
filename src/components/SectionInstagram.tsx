"use client";
import { useEffect, useState } from "react";

// const instagramPosts = [
//   {
//     id: "1",
//     media_url:
//       "/api/proxy?url=https://instagram.com/p/DFwAP2ism-m/media/?size=l",
//     permalink: "https://www.instagram.com/p/DFwAP2ism-m/",
//   },
//   {
//     id: "2",
//     media_url:
//       "/api/proxy?url=https://instagram.com/p/DFlqzTCO75G/media/?size=l",
//     permalink: "https://www.instagram.com/p/DFlqzTCO75G/",
//   },
//   {
//     id: "3",
//     media_url:
//       "/api/proxy?url=https://instagram.com/p/DFbd1tyulLN/media/?size=l",
//     permalink: "https://www.instagram.com/p/DFbd1tyulLN/",
//   },
//   {
//     id: "4",
//     media_url:
//       "/api/proxy?url=https://instagram.com/p/DE582QwODkb/media/?size=l",
//     permalink: "https://www.instagram.com/p/DE582QwODkb/",
//   },
//   {
//     id: "5",
//     media_url:
//       "/api/proxy?url=https://instagram.com/p/DEyOQMDORYj/media/?size=l",
//     permalink: "https://www.instagram.com/p/DEyOQMDORYj/",
//   },
//   {
//     id: "6",
//     media_url:
//       "/api/proxy?url=https://instagram.com/p/DEQpLeWpGEt/media/?size=l",
//     permalink: "https://www.instagram.com/p/DEQpLeWpGEt/",
//   },
// ];

interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
}

export default function SectionInstagram() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        const response = await fetch("/api/instagram");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching Instagram posts:", error);
      }
    };

    fetchInstagramPosts();
  }, []);

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="relative w-full aspect-square">
              <img
                key={post.id}
                src={`/api/instagram/image?postId=${post.id}`}
                alt="Instagram post"
                className="w-full h-full rounded-lg object-cover"
              />
            </div>
          </a>
        ))}
      </div>
      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-3">        
        {instagramPosts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="relative w-full aspect-square">
              <Image
                src={post.media_url}
                alt="Instagram Post"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg hover:opacity-80 transition-opacity"
              />
            </div>
          </a>
        ))}
      </div> */}
    </div>
  );
}
