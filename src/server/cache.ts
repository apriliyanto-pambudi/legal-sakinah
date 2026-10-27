import { revalidateTag } from "next/cache";

export const CACHE_TAGS = {
  services: "services",
  faqs: "faqs",
  team: "team",
  pages: "pages",
  landingPages: "landing-pages",
  siteSettings: "site-settings",
} as const;

/** Next.js 16: profile `max` menandai tag stale (stale-while-revalidate). */
export function revalidateCmsTag(tag: string) {
  revalidateTag(tag, "max");
}
