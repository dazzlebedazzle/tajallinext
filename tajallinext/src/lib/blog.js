// Server-side helpers for the blog pages.
// Pages are statically regenerated (ISR) every REVALIDATE seconds, so new or edited posts
// appear within a few minutes without hitting the API on every request.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tajalli.co.in').replace(/\/$/, '');
export const REVALIDATE = 300;

const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/\/$/, '');

async function getJson(path) {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: REVALIDATE, tags: ['blogs'] } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Blog API error for ${path}:`, error.message);
    return null;
  }
}

export async function getBlogs() {
  const data = await getJson('/api/blogs/getBlog');
  return Array.isArray(data) ? data : [];
}

export async function getBlog(slug) {
  if (!slug) return null;
  return getJson(`/api/blogs/getBlogSlug/${encodeURIComponent(slug)}`);
}

export async function getBlogsByTag(tag) {
  if (!tag) return [];
  const data = await getJson(`/api/blogs/getBlogTag/${encodeURIComponent(tag)}`);
  return Array.isArray(data) ? data : [];
}

// "dry-fruits" <-> "dry fruits"
export const tagToSlug = (tag) => String(tag).trim().toLowerCase().replace(/\s+/g, '-');
export const slugToTag = (slug) => decodeURIComponent(String(slug)).replace(/-/g, ' ').trim().toLowerCase();

export const publishedDate = (post) => post.publishedAt || post.createdAt;

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })
    : '';

// Rough reading time for Markdown content
export const readingMinutes = (content = '') =>
  Math.max(1, Math.round(String(content).split(/\s+/).filter(Boolean).length / 200));

export const blogUrl = (slug) => `${SITE_URL}/blogs/${slug}`;

// Safe JSON for <script type="application/ld+json">
export const jsonLd = (data) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') });
