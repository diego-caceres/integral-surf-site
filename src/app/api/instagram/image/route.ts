import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://www.instagram.com/",
      },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType?.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid image response" },
        { status: 400 }
      );
    }

    return new NextResponse(response.body, {
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch image", errorOriginal: error },
      { status: 500 }
    );
  }
}

// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   const postUrl = req.nextUrl.searchParams.get("postUrl");
//   if (!postUrl) {
//     return NextResponse.json({ error: "Missing post URL" }, { status: 400 });
//   }

//   try {
//     // Fetch image from Instagram
//     const response = await fetch(postUrl, {
//       headers: {
//         "User-Agent": "Mozilla/5.0", // Spoof user-agent to avoid bot detection
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch Instagram image");
//     }

//     const buffer = await response.arrayBuffer();

//     return new NextResponse(buffer, {
//       status: 200,
//       headers: {
//         "Content-Type": "image/jpeg",
//         "Cache-Control": "s-maxage=86400, stale-while-revalidate",
//       },
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Image fetch failed", original: error },
//       { status: 500 }
//     );
//   }
// }
