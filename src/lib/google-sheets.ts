/**
 * google-sheets.ts
 *
 * Server-only module — runs exclusively at build time.
 * Fetches LinkedIn post data from the "LinkedIn Posts Scrapped Raw" tab
 * of the configured Google Sheet using the Sheets API v4 + an API Key.
 *
 * Environment variables required:
 *   GOOGLE_SHEETS_API_KEY  — Google Cloud API key with Sheets API enabled
 *   GOOGLE_SHEET_ID        — The spreadsheet ID (from the sheet URL)
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LinkedInPost {
  /** URL-safe slug generated from the post title */
  slug: string;
  /** "Article Title" column */
  title: string;
  /** "Scraped Description" column */
  excerpt: string;
  /** ISO date string — falls back to today if the cell is empty */
  date: string;
  /** "Author Info" column */
  author: string;
  /** "Link" column — direct URL to the LinkedIn post */
  externalUrl: string;
  /** First URL from the "Media URLs" column, if present */
  coverImage?: string;
  /** "Reaction Counts" column */
  likes: number;
  /** "Comment Counts" column */
  comments: number;
  /** "Repost Counts" column */
  reposts: number;
  /** Always ["LinkedIn"] so the existing tag filter picks it up */
  tags: string[];
  /** Always "LinkedIn Post" for the category filter */
  category: string;
  /** Estimated read time — fixed at 2 min for LinkedIn posts */
  readTime: number;
  /** Discriminator flag used by InsightsPageClient to render the badge */
  isLinkedIn: true;
  /** No internal detail page — cards always link externally */
  relatedPosts: never[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SHEET_TAB = 'LinkedIn Posts Scrapped Raw';

// Expected column header names (case-insensitive match)
const COL = {
  TITLE:     'article title',
  LINK:      'link',
  DESC:      'scraped description',
  AUTHOR:    'author info',
  REACTIONS: 'reaction counts',
  COMMENTS:  'comment counts',
  REPOSTS:   'repost counts',
  MEDIA:     'media urls',
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);
}

function toNumber(val: string | undefined): number {
  if (!val || val.trim() === '') return 0;
  const n = parseInt(val.replace(/[^0-9]/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

function firstUrl(val: string | undefined): string | undefined {
  if (!val || val.trim() === '') return undefined;
  const urls = val.split(/[\s,\n]+/).filter((u) => u.startsWith('http'));
  return urls[0];
}

function buildColumnMap(headers: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  headers.forEach((h, i) => {
    map[h.toLowerCase().trim()] = i;
  });
  return map;
}

function validateHeaders(colMap: Record<string, number>): void {
  const required = Object.values(COL);
  for (const col of required) {
    if (colMap[col] === undefined) {
      console.warn(
        `[google-sheets] ⚠️  Missing expected column "${col}" in "${SHEET_TAB}". ` +
        `Rows may be skipped or fields may be empty.`
      );
    }
  }
}

// ─── Main Fetch Function ──────────────────────────────────────────────────────

export async function getLinkedInPosts(): Promise<LinkedInPost[]> {
  const apiKey  = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!apiKey || !sheetId) {
    console.warn(
      '[google-sheets] GOOGLE_SHEETS_API_KEY or GOOGLE_SHEET_ID not set. ' +
      'Skipping LinkedIn posts fetch.'
    );
    return [];
  }

  const range  = encodeURIComponent(`${SHEET_TAB}!A:Z`);
  const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  let rows: string[][];
  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[google-sheets] Sheets API responded with ${res.status}: ${body}`);
      return [];
    }

    const json = await res.json() as { values?: string[][] };
    rows = json.values ?? [];
  } catch (err) {
    console.error('[google-sheets] Network error fetching sheet data:', err);
    return [];
  }

  if (rows.length < 2) {
    console.warn(`[google-sheets] "${SHEET_TAB}" tab has fewer than 2 rows (no data rows found).`);
    return [];
  }

  const [headerRow, ...dataRows] = rows;
  const colMap = buildColumnMap(headerRow);
  validateHeaders(colMap);

  const today = new Date().toISOString();
  const posts: LinkedInPost[] = [];

  dataRows.forEach((row, idx) => {
    const get = (col: string): string => (row[colMap[col]] ?? '').trim();

    const title = get(COL.TITLE);
    const link  = get(COL.LINK);

    if (!title || !link) {
      if (title || link) {
        console.warn(`[google-sheets] Row ${idx + 2}: skipped — missing title or link.`);
      }
      return;
    }

    const slug = toSlug(title) || `linkedin-post-${idx + 2}`;

    posts.push({
      slug,
      title,
      excerpt:      get(COL.DESC)    || 'Read this LinkedIn post by Deven Goratela.',
      date:         today,
      author:       get(COL.AUTHOR)  || 'Deven Goratela',
      externalUrl:  link,
      coverImage:   firstUrl(get(COL.MEDIA)),
      likes:        toNumber(get(COL.REACTIONS)),
      comments:     toNumber(get(COL.COMMENTS)),
      reposts:      toNumber(get(COL.REPOSTS)),
      tags:         ['LinkedIn'],
      category:     'LinkedIn Post',
      readTime:     2,
      isLinkedIn:   true,
      relatedPosts: [],
    });
  });

  console.warn(
    `[google-sheets] ✅ Loaded ${posts.length} LinkedIn posts from "${SHEET_TAB}".`
  );
  return posts;
}
