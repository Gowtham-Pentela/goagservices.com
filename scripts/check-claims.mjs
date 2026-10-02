#!/usr/bin/env node
/**
 * check-claims.mjs
 * Scans src/, index.html, and public/ for forbidden marketing claims.
 * Run: node scripts/check-claims.mjs
 * Hooked before build via package.json "prebuild" script.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const ROOT = new URL("..", import.meta.url).pathname;

// --- Configuration ---

/** Extensions to scan */
const SCAN_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".html", ".json", ".md"];

/** Directories to scan */
const SCAN_DIRS = ["src", "index.html", "public"];

/** Directories to skip */
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", "scripts"]);

/**
 * Forbidden patterns.
 * Each entry: { pattern, description, fileIncludes? }
 * fileIncludes: if set, only files whose path includes this substring are checked.
 */
const FORBIDDEN = [
  // Fabricated performance claims (never verified)
  { pattern: /25\s*acres/i, description: '"25 acres" coverage claim' },
  { pattern: /7\s*minut/i, description: '"7 minute" acre claim' },
  { pattern: /8\.5\s*acres/i, description: '"8.5 acres/hr" claim' },

  // Forbidden product names in user-visible text (slug alias table keys are backward-compat, not names)
  // Patterns only match as display names (e.g. "Agrown-x & Agrown-x Pro") not lowercase slug keys
  {
    pattern: /Agrown-[xX]\b(?!\s*Super|\s*Pro|-10|-5)/,
    description: '"Agrown-x" legacy product name in display text (use Agrown-10X)',
    fileIncludes: [".ts", ".tsx", ".js", ".jsx", ".html"],
  },
  {
    pattern: /Agrown-[xX]\s+Pro/,
    description: '"Agrown-x Pro" legacy product name (use Agrown-10X Super Compact)',
    fileIncludes: [".ts", ".tsx", ".js", ".jsx", ".html"],
  },
  {
    // Catches "Agrown-5X" as a display name — slug key "agrown-5x" is lowercase and excluded
    pattern: /Agrown-5X/,
    description: '"Agrown-5X" legacy product name (use Agrown-10X Super Compact)',
    fileIncludes: [".ts", ".tsx", ".js", ".jsx", ".html"],
  },

  // Forbidden Greaydon spelling in user-visible src (Python scripts keep folder names for asset compat)
  // Asset path references (e.g. /drones-360/greaydon-base/...) and slug-alias keys are intentional
  // backward-compat entries — only the visible product name matters.
  // Pattern: "Greaydon" followed by whitespace or end-of-string (catches display names but not URL paths)
  {
    pattern: /Greaydon(?=\s|"|'|$)/,
    description: '"Greaydon" misspelling as brand name (use Graydon)',
    fileIncludes: [".ts", ".tsx", ".js", ".jsx", ".html"],
  },

  // Legacy domain
  {
    pattern: /goagdrones\.com/i,
    description: '"goagdrones.com" legacy domain',
    fileIncludes: [".ts", ".tsx", ".js", ".jsx", ".html"],
  },

  // Warranty wording
  { pattern: /\bcomprehensive\s+warranty/i, description: '"comprehensive warranty" phrase' },
  { pattern: /\bfull\s+warranty/i, description: '"full warranty" phrase' },
  { pattern: /\bpeace\s+of\s+mind\b/i, description: '"peace of mind" filler phrase' },

  // Regulatory — DGCA removed by owner decision; block all mentions
  // claims.ts excluded because it keeps the placeholder record with status "placeholder"
  {
    pattern: /DGCA/i,
    description: 'DGCA mention removed by owner — re-add only with certificate number',
    fileIncludes: [".ts", ".tsx", ".js", ".jsx", ".html"],
    fileExcludes: ["claims.ts", "check-claims.mjs"],
  },
  { pattern: /type\s+certif/i, description: '"type certification" claim' },
  { pattern: /\bcompliant\b/i, description: '"compliant" regulatory overclaim' },

  // Chemical claim (never verified)
  {
    pattern: /\b30\s*%\s*(chemical|reduction|less\s+chemical|savings)/i,
    description: '"30% chemical reduction" unverified claim',
  },

  // Tank size overclaim
  { pattern: /\b100\s*[Ll](?:itres?|iters?)\b/, description: '"100L" capacity claim' },

  // Unverified claims — must be routed via claims.ts governance
  {
    pattern: /Global Delivery/i,
    description: '"Global Delivery" claim (unverified — must be routed via claims.ts)',
    fileIncludes: [".ts", ".tsx", ".js", ".jsx", ".html"],
    fileExcludes: ["claims.ts", "check-claims.mjs"],
  },
  {
    pattern: /Certified Flight Test Pilots/i,
    description: '"Certified Flight Test Pilots" claim (unverified — must be routed via claims.ts)',
    fileIncludes: [".ts", ".tsx", ".js", ".jsx", ".html"],
    fileExcludes: ["claims.ts", "check-claims.mjs"],
  },
  {
    pattern: /Every specification on this site is verified/i,
    description: '"Every specification is verified" claim (unverified — must be routed via claims.ts)',
    fileIncludes: [".ts", ".tsx", ".js", ".jsx", ".html"],
    fileExcludes: ["claims.ts", "check-claims.mjs"],
  },
];

// --- Scanner ---

let totalErrors = 0;

function shouldScan(filePath, ext) {
  return SCAN_EXTENSIONS.includes(ext);
}

function checkFile(filePath) {
  let content;
  try {
    content = readFileSync(filePath, "utf-8");
  } catch {
    return;
  }

  const lines = content.split("\n");
  const relPath = relative(ROOT, filePath);

  for (const rule of FORBIDDEN) {
    // Extension filter
    if (rule.fileIncludes) {
      const matchesFilter = rule.fileIncludes.some((ext) => filePath.endsWith(ext));
      if (!matchesFilter) continue;
    }

    // Path exclusion filter
    if (rule.fileExcludes) {
      const isExcluded = rule.fileExcludes.some((excl) => filePath.includes(excl));
      if (isExcluded) continue;
    }

    lines.forEach((line, idx) => {
      if (rule.pattern.test(line)) {
        console.error(`\n  ❌ ${relPath}:${idx + 1}`);
        console.error(`     Rule: ${rule.description}`);
        console.error(`     Line: ${line.trim().slice(0, 120)}`);
        totalErrors++;
      }
    });
  }
}

function walk(pathOrFile) {
  let stat;
  try {
    stat = statSync(pathOrFile);
  } catch {
    return;
  }

  if (stat.isDirectory()) {
    const name = pathOrFile.split("/").pop();
    if (SKIP_DIRS.has(name)) return;
    for (const entry of readdirSync(pathOrFile)) {
      walk(join(pathOrFile, entry));
    }
  } else {
    const ext = "." + pathOrFile.split(".").pop();
    if (shouldScan(pathOrFile, ext)) {
      checkFile(pathOrFile);
    }
  }
}

// --- Run ---

console.log("🔍 GoAG claims enforcer — scanning for forbidden strings...\n");
for (const target of SCAN_DIRS) {
  walk(join(ROOT, target));
}

if (totalErrors === 0) {
  console.log("✅ All clear — no forbidden claims found.\n");
  process.exit(0);
} else {
  console.error(`\n🚫 Found ${totalErrors} forbidden claim(s). Fix before building.\n`);
  process.exit(1);
}
