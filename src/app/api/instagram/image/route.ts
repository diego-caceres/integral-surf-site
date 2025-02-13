import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  try {
    const postUrl = `https://www.instagram.com/p/${postId}/`;
    const response = await fetch(postUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://www.instagram.com/",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Instagram post: ${response.status}`);
    }

    const html = await response.text();

    // Extract JSON from Instagram's HTML
    const jsonMatch = html.match(/window\._sharedData\s*=\s*(\{.+?\});/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON data from Instagram");
    }

    const jsonData = JSON.parse(jsonMatch[1]);

    // Navigate the JSON structure to find the display URL
    const imageUrl =
      jsonData.entry_data?.PostPage?.[0]?.graphql?.shortcode_media?.display_url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL not found" },
        { status: 404 }
      );
    }

    // Fetch the actual image
    const imageResponse = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!imageResponse.ok) {
      throw new Error("Failed to fetch Instagram image");
    }

    return new NextResponse(imageResponse.body, {
      status: 200,
      headers: {
        "Content-Type":
          imageResponse.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "s-maxage=86400, stale-while-revalidate",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch image", details: error },
      { status: 500 }
    );
  }
}
