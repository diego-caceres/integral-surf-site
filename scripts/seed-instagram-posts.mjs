import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");
const env = Object.fromEntries(
  readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const eq = line.indexOf("=");
      const val = line.slice(eq + 1).trim();
      return [line.slice(0, eq).trim(), val.replace(/^["']|["']$/g, "")];
    })
);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false },
});

const posts = [
  {
    post_url: "https://www.instagram.com/p/DDiWOPyudcT/",
    image_url: "/images/instagram/instagram1.jpg",
    order_number: 0,
  },
  {
    post_url: "https://www.instagram.com/p/DF_dOCIO8Sq/",
    image_url: "/images/instagram/instagram2.jpg",
    order_number: 1,
  },
  {
    post_url: "https://www.instagram.com/p/DFwAP2ism-m/",
    image_url: "/images/instagram/instagram3.jpg",
    order_number: 2,
  },
  {
    post_url: "https://www.instagram.com/p/DFlqzTCO75G/",
    image_url: "/images/instagram/instagram4.jpg",
    order_number: 3,
  },
  {
    post_url: "https://www.instagram.com/p/DFbd1tyulLN/",
    image_url: "/images/instagram/instagram5.jpg",
    order_number: 4,
  },
  {
    post_url: "https://www.instagram.com/p/DE582QwODkb/",
    image_url: "/images/instagram/instagram6.jpg",
    order_number: 5,
  },
];

const { error } = await supabase.from("instagram_posts").insert(posts);

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log(`Seeded ${posts.length} Instagram posts successfully.`);
