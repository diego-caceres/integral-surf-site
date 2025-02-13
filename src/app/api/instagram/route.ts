import { NextResponse } from "next/server";

const INSTAGRAM_POSTS = [
  {
    id: "1",
    media_url: "https://www.instagram.com/p/DFwAP2ism-m/media/",
    permalink: "https://www.instagram.com/p/DFwAP2ism-m/",
  },
  {
    id: "2",
    media_url: "https://www.instagram.com/p/DFlqzTCO75G/media/",
    permalink: "https://www.instagram.com/p/DFlqzTCO75G/",
  },
  {
    id: "3",
    media_url: "https://www.instagram.com/p/DFbd1tyulLN/media/",
    permalink: "https://www.instagram.com/p/DFbd1tyulLN/",
  },
  {
    id: "4",
    media_url: "https://www.instagram.com/p/DE582QwODkb/media/",
    permalink: "https://www.instagram.com/p/DE582QwODkb/",
  },
  {
    id: "5",
    media_url: "https://www.instagram.com/p/DEyOQMDORYj/media/",
    permalink: "https://www.instagram.com/p/DEyOQMDORYj/",
  },
  {
    id: "6",
    media_url: "https://www.instagram.com/p/DEQpLeWpGEt/media/",
    permalink: "https://www.instagram.com/p/DEQpLeWpGEt/",
  },
];

export async function GET() {
  return NextResponse.json(INSTAGRAM_POSTS);
}
