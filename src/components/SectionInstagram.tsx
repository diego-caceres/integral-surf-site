"use client";
import Image from "next/image";

const instagramPosts = [
  {
    id: "1",
    media_url: "https://instagram.com/p/DFwAP2ism-m/media/?size=l",
    permalink: "https://www.instagram.com/p/DFwAP2ism-m/",
    imagePath: "/images/instagram/instagram1.jpg",
  },
  {
    id: "2",
    media_url: "https://instagram.com/p/DFlqzTCO75G/media/?size=l",
    permalink: "https://www.instagram.com/p/DFlqzTCO75G/",
    imagePath: "/images/instagram/instagram2.jpg",
  },
  {
    id: "3",
    media_url: "https://instagram.com/p/DFbd1tyulLN/media/?size=l",
    permalink: "https://www.instagram.com/p/DFbd1tyulLN/",
    imagePath: "/images/instagram/instagram3.jpg",
  },
  {
    id: "4",
    media_url: "https://instagram.com/p/DE582QwODkb/media/?size=l",
    permalink: "https://www.instagram.com/p/DE582QwODkb/",
    imagePath: "/images/instagram/instagram4.jpg",
  },
  {
    id: "5",
    media_url: "https://instagram.com/p/DEyOQMDORYj/media/?size=l",
    permalink: "https://www.instagram.com/p/DEyOQMDORYj/",
    imagePath: "/images/instagram/instagram5.jpg",
  },
  {
    id: "6",
    media_url: "https://instagram.com/p/DEQpLeWpGEt/media/?size=l",
    permalink: "https://www.instagram.com/p/DEQpLeWpGEt/",
    imagePath: "/images/instagram/instagram6.jpg",
  },
];

export default function SectionInstagram() {
  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {instagramPosts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="relative w-full aspect-square">
              <Image
                src={post.imagePath}
                alt="Instagram Post"
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
