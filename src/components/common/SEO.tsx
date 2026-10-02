import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_TITLE = "GoAG Services — Turn Every Acre into Profit with Precision Drone Spraying";
const DEFAULT_DESC =
  "GoAG Services Private Limited — High-precision agricultural spraying drones engineered in Hyderabad. 1 acre in 7 minutes (~8.5 acres/hour), micro-atomized droplet control, 80% Indian content, ₹20/acre battery cost, and 2-year warranty.";
const DEFAULT_KEYWORDS =
  "agricultural drone manufacturer India, precision agriculture drone, crop spraying drone Hyderabad, Agrown-x, Agrown-x Pro hexacopter, Agrown-Swift 20, agricultural drone price per acre, FPO drone subsidy, farm drone spraying Telangana, DGCA architecture ready drone India, paddy spraying drone, sugarcane drone sprayer";
const SITE_URL = typeof window !== "undefined" && window.location.origin.includes("github.io")
  ? window.location.origin + (import.meta.env.BASE_URL?.replace(/\/$/, "") || "")
  : "https://goagdrones.com";
const DEFAULT_IMAGE = "https://goagdrones.com/logo.png";

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = DEFAULT_IMAGE,
  ogType = "website",
  schema,
}: SEOProps) {
  const { pathname } = useLocation();
  const currentUrl = canonical ? `${SITE_URL}${canonical}` : `${SITE_URL}${pathname}`;

  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Helper to set or create meta tag
    const setMeta = (nameAttr: string, key: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${key}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(nameAttr, key);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Standard Meta
    setMeta("name", "description", description);
    setMeta("name", "keywords", keywords);
    setMeta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setMeta("name", "author", "GoAG Services Private Limited");

    // Open Graph
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", currentUrl);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:site_name", "GoAG Services");
    setMeta("property", "og:locale", "en_IN");

    // Twitter Card
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", currentUrl);

    // Schema.org Structured Data
    const scriptId = "page-structured-data";
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = scriptId;
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, keywords, currentUrl, ogImage, ogType, schema]);

  return null;
}
