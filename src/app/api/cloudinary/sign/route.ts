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

// `paramsToSign` is forwarded verbatim by next-cloudinary's
// generateSignatureCallback (@cloudinary-util/url-loader) from Cloudinary's
// hosted upload widget — our code never constructs it. For the widget config
// used across this app (CloudinaryUploadButton: folder only, single file, no
// eager/tags/context transformations), Cloudinary's documented signing
// contract sends `timestamp` plus the configured options below. Deliberately
// excludes `overwrite` and `invalidate`, which could target/replace assets
// outside the folder check — if a legitimate upload ever fails here with a
// "Params not permitted" error, add the exact key it names, not a blanket fix.
const ALLOWED_SIGN_KEYS = new Set([
  "timestamp",
  "source",
  "folder",
  "public_id",
  "upload_preset",
  "tags",
  "context",
  "use_filename",
  "unique_filename",
]);

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

    const unknownKeys = Object.keys(paramsToSign).filter(
      (k) => !ALLOWED_SIGN_KEYS.has(k)
    );
    if (unknownKeys.length > 0) {
      return NextResponse.json(
        { error: `Params not permitted: ${unknownKeys.join(", ")}` },
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
