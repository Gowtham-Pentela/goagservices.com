import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { contactInfo } from "../../content/contact";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_TITLE = "GoAG Services — Engineered in India. Built for Real Missions.";
const DEFAULT_DESC =
  "GoAG Services Private Limited — Indian UAV Manufacturer of Agricultural Drones, Multi-Payload Systems, and Custom Unmanned Solutions engineered in Hyderabad. 80% Made in India with up to 2 years warranty.";
const DEFAULT_KEYWORDS =
  "agricultural drone manufacturer India, precision agriculture drone, crop spraying drone Hyderabad, Agrown-10X, Agrown-10X Super Compact, Graydon multi-payload drone, Made in India drone, DGCA certified drone Hyderabad";

const SITE_URL = import.meta.env.VITE_SITE_URL || "";
const IS_NOINDEX = import.meta.env.VITE_NOINDEX === "true";
const BASE_PATH = import.meta.env.BASE_URL || "/";

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = `${BASE_PATH}images/logo.png`,
  ogType = "website",
  schema,
}: SEOProps) {
  const { pathname } = useLocation();

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
    setMeta("name", "robots", IS_NOINDEX ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setMeta("name", "author", contactInfo.companyName);

    // Open Graph
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:site_name", contactInfo.companyName);
    setMeta("property", "og:locale", "en_IN");

    // Twitter Card
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);

    // Canonical link handling: per owner instructions, only set when VITE_SITE_URL is defined
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (SITE_URL) {
      const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : `${SITE_URL}${pathname}`;
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", canonicalUrl);
      setMeta("property", "og:url", canonicalUrl);
    } else if (canonicalLink) {
      canonicalLink.remove();
    }

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
  }, [title, description, keywords, canonical, ogImage, ogType, schema, pathname]);

  return null;
}
