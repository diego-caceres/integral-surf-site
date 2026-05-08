"use client";

import { useEffect } from "react";

export default function HashScroller() {
  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return null;
}
