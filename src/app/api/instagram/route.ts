import { NextResponse } from "next/server";

const INSTAGRAM_POSTS = [
  {
    id: "DFwAP2ism-m",
    media_url: "https://www.instagram.com/p/DFwAP2ism-m/media/",
    permalink: "https://www.instagram.com/p/DFwAP2ism-m/",
  },
  {
    id: "DFlqzTCO75G",
    media_url: "https://www.instagram.com/p/DFlqzTCO75G/media/",
    permalink: "https://www.instagram.com/p/DFlqzTCO75G/",
  },
  {
    id: "DFbd1tyulLN",
    media_url: "https://www.instagram.com/p/DFbd1tyulLN/media/",
    permalink: "https://www.instagram.com/p/DFbd1tyulLN/",
  },
  {
    id: "DE582QwODkb",
    media_url: "https://www.instagram.com/p/DE582QwODkb/media/",
    permalink: "https://www.instagram.com/p/DE582QwODkb/",
  },
  {
    id: "DEyOQMDORYj",
    media_url: "https://www.instagram.com/p/DEyOQMDORYj/media/",
    permalink: "https://www.instagram.com/p/DEyOQMDORYj/",
  },
  {
    id: "DEQpLeWpGEt",
    media_url: "https://www.instagram.com/p/DEQpLeWpGEt/media/",
    permalink: "https://www.instagram.com/p/DEQpLeWpGEt/",
  },
];

export async function GET() {
  return NextResponse.json(INSTAGRAM_POSTS);
}
