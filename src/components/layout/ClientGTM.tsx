"use client";
import { usePathname } from "next/navigation";
import { GoogleTagManager } from "@next/third-parties/google";

// Falls back to the current production container id so behavior is
// unchanged if NEXT_PUBLIC_GTM_ID isn't set in a given environment (e.g. a
// preview deploy without the var configured yet) — set the env var to
// override without a code change.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-P874N777";
// Excluded so admin traffic (and dev/testing sessions in the admin panel)
// never pollutes conversion analytics — the whatsapp_click events this feeds
// (see src/lib/analytics.ts) are only meaningful from public visitors.
const EXCLUDED_PREFIXES = ["/admin", "/nuevo-viaje"];

export function isGtmExcludedPath(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default function ClientGTM() {
  const pathname = usePathname();
  if (isGtmExcludedPath(pathname)) return null;
  return <GoogleTagManager gtmId={GTM_ID} />;
}
