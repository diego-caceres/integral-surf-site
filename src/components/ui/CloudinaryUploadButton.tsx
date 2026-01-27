"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

interface CloudinaryUploadButtonProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  showPreview?: boolean;
  previewClassName?: string;
  required?: boolean;
}

export default function CloudinaryUploadButton({
  value,
  onChange,
  label,
  folder,
  showPreview = true,
  previewClassName,
  required = false,
}: CloudinaryUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex gap-2">
        {/* Upload Button */}
        <CldUploadWidget
          signatureEndpoint="/api/cloudinary/sign"
          options={{
            folder: folder || "integral-surf",
            maxFiles: 1,
            sources: ["local", "url", "camera"],
            multiple: false,
          }}
          onSuccess={(result) => {
            if (
              typeof result.info === "object" &&
              result.info &&
              "secure_url" in result.info
            ) {
              onChange(result.info.secure_url as string);
              setUploading(false);
              setError(null);
            }
          }}
          onError={(error) => {
            console.error("Cloudinary upload error:", error);
            setError("Upload failed. Please try again or enter URL manually.");
            setUploading(false);
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => {
                setUploading(true);
                setError(null);
                open();
              }}
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          )}
        </CldUploadWidget>

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Text Input for Manual URL */}
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL here"
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {/* Error Display */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Image Preview - using native img to avoid next/image hostname restrictions */}
      {showPreview && value && (
        <div className="mt-2 relative">
          <p className="text-xs text-gray-500 mb-1">Preview:</p>
          <div className={previewClassName || "relative w-full max-w-xs h-32 border rounded bg-gray-50 flex items-center justify-center"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={label || "Preview"}
              className="max-w-full max-h-full object-contain p-1"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const sibling = e.currentTarget.nextElementSibling;
                if (sibling) {
                  (sibling as HTMLElement).style.display = "block";
                }
              }}
            />
            <p className="hidden text-gray-400 text-sm">Unable to load preview</p>
          </div>
        </div>
      )}
    </div>
  );
}
