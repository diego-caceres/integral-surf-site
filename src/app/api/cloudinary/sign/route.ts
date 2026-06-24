import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploads are confined to this folder tree so a signature can't be used to
// overwrite arbitrary assets elsewhere in the Cloudinary account.
const ALLOWED_FOLDER_PREFIX = "integral-surf";

export async function POST(request: NextRequest) {
  // Authentication is enforced in middleware.ts; this is the second gate so a
  // valid signature can never be minted for an attacker-controlled destination.
  try {
    const body = await request.json();
    const paramsToSign = body?.paramsToSign;

    if (!paramsToSign || typeof paramsToSign !== "object") {
      return NextResponse.json(
        { error: "Missing or invalid paramsToSign" },
        { status: 400 }
      );
    }

    const withinAllowedFolder = (value: unknown) =>
      typeof value === "string" &&
      (value === ALLOWED_FOLDER_PREFIX ||
        value.startsWith(`${ALLOWED_FOLDER_PREFIX}/`));

    const { folder, public_id: publicId } = paramsToSign as {
      folder?: unknown;
      public_id?: unknown;
    };

    // Require an explicit, in-bounds folder, and reject any public_id that would
    // place (or overwrite) an asset outside the allowed tree.
    if (!withinAllowedFolder(folder)) {
      return NextResponse.json(
        { error: "Upload folder is not permitted" },
        { status: 400 }
      );
    }
    if (publicId !== undefined && !withinAllowedFolder(publicId)) {
      return NextResponse.json(
        { error: "Upload public_id is not permitted" },
        { status: 400 }
      );
    }

    // Generate signature using Cloudinary SDK
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({ signature });
  } catch (error) {
    console.error("Error signing Cloudinary request:", error);
    return NextResponse.json(
      { error: "Failed to sign upload request" },
      { status: 500 }
    );
  }
}
