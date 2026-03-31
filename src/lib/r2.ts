/**
 * r2.ts — Cloudflare Native R2 helpers
 * This version uses native Worker bindings to avoid [unenv] fs.readFile errors.
 */

import type { BlogPost, BlogPostIndex, BlogPostMeta } from "@/types";

// ─── Native Binding Helper ───────────────────────────────────────────────────

/**
 * Access the R2 bucket directly from the Cloudflare Worker environment.
 * Requires [[r2_buckets]] binding = 'R2_BUCKET' in wrangler.toml.
 */
import { getCloudflareContext } from "@opennextjs/cloudflare";

const getBucket = (): R2Bucket => {
  try {
    const { env } = getCloudflareContext();
    const bucket = (env as Record<string, unknown>).R2_BUCKET as R2Bucket | undefined;
    if (bucket && typeof bucket.get === "function") {
      return bucket;
    }
  } catch (e) {
    // Context unavailable during build or static generation
    console.error("getCloudflareContext() failed:", e);
  }

  throw new Error(
    "R2_BUCKET is not available from the Cloudflare context.\n" +
    "Checklist:\n" +
    "1. Ensure you are visiting port 8787 (Wrangler), NOT 3000.\n" +
    "2. Check that [[r2_buckets]] binding = 'R2_BUCKET' is in wrangler.toml.\n" +
    "3. Run 'npm run cf-typegen' to update binding definitions.\n" +
    "4. Ensure this code only runs during a request (not at build time)."
  );
};

/** * Ensures the index file exists so the UI doesn't break on a fresh bucket.
 */
async function ensureIndexExists(): Promise<BlogPostIndex> {
  const emptyIndex: BlogPostIndex = {
    posts: [],
    updated_at: new Date().toISOString()
  };

  try {
    const bucket = getBucket();
    const existing = await bucket.get(INDEX_KEY);

    if (!existing) {
      console.log("📝 Initializing empty posts/index.json...");
      await putJson(INDEX_KEY, emptyIndex);
      return emptyIndex;
    }

    return await existing.json() as BlogPostIndex;
  } catch (err) {
    console.error("Failed to ensure index exists:", err);
    return emptyIndex;
  }
}

const PUBLIC_URL = () => process.env.R2_PUBLIC_URL ?? "";

// ─── Generic helpers (Using Native R2 API) ───────────────────────────────────

async function getJson<T>(key: string): Promise<T | null> {
  try {
    const object = await getBucket().get(key);
    if (!object) return null;
    return await object.json() as T;
  } catch (err) {
    console.error(`Error fetching JSON [${key}]:`, err);
    return null;
  }
}

async function putJson<T>(key: string, value: T): Promise<void> {
  await getBucket().put(key, JSON.stringify(value, null, 2), {
    httpMetadata: { contentType: "application/json" },
  });
}

async function putBinary(
  key: string,
  body: Uint8Array | Buffer | Blob | ArrayBuffer,
  contentType: string
): Promise<string> {
  await getBucket().put(key, body, {
    httpMetadata: { contentType },
  });
  return `${PUBLIC_URL()}/${key}`;
}

async function deleteObject(key: string): Promise<void> {
  await getBucket().delete(key);
}

// ─── Index management ─────────────────────────────────────────────────────────

const INDEX_KEY = "posts/index.json";

async function getIndex(): Promise<BlogPostIndex> {
  try {
    const bucket = getBucket();
    const res = await bucket.get(INDEX_KEY);

    if (!res) {
      // SEED: If it doesn't exist, create it immediately
      console.log("Creating initial posts/index.json...");
      const newIndex = { posts: [], updated_at: new Date().toISOString() };
      await putJson(INDEX_KEY, newIndex);
      return newIndex;
    }

    return await res.json() as BlogPostIndex;
  } catch (err) {
    // Return empty state so the UI doesn't crash while we debug the binding
    console.error("getIndex Error:", err);
    return { posts: [], updated_at: new Date().toISOString() };
  }

  //const idx = await getJson<BlogPostIndex>(INDEX_KEY);
  //return idx ?? { posts: [], updated_at: new Date().toISOString() };
}

async function saveIndex(index: BlogPostIndex): Promise<void> {
  await putJson(INDEX_KEY, { ...index, updated_at: new Date().toISOString() });
}

// ─── Public API (Logic remains the same, helpers changed) ─────────────────────

export async function getAllPostsMeta(): Promise<BlogPostMeta[]> {
  const index = await getIndex();
  return index.posts.filter((p) => p.published);
}

export async function getAllPostsAdmin(): Promise<BlogPostMeta[]> {
  const index = await getIndex();
  return index.posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return getJson<BlogPost>(`posts/${slug}.json`);
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const index = await getIndex();
  const meta = index.posts.find((p) => p.id === id);
  if (!meta) return null;
  return getPostBySlug(meta.slug);
}

export async function upsertPost(post: BlogPost): Promise<void> {
  await putJson(`posts/${post.slug}.json`, post);

  const index = await getIndex();
  const { content: _content, ...meta } = post;
  const existing = index.posts.findIndex((p) => p.id === post.id);

  if (existing >= 0) {
    index.posts[existing] = meta;
  } else {
    index.posts.unshift(meta);
  }
  await saveIndex(index);
}

export async function deletePost(id: string): Promise<boolean> {
  const index = await getIndex();
  const meta = index.posts.find((p) => p.id === id);
  if (!meta) return false;

  await deleteObject(`posts/${meta.slug}.json`);
  index.posts = index.posts.filter((p) => p.id !== id);
  await saveIndex(index);
  return true;
}

export async function uploadCoverImage(
  slug: string,
  buffer: Buffer | ArrayBuffer | Uint8Array,
  mimeType: string
): Promise<string> {
  const ext = mimeType.split("/")[1] ?? "jpg";
  const key = `images/covers/${slug}.${ext}`;
  return putBinary(key, buffer, mimeType);
}

export async function uploadInlineImage(
  filename: string,
  buffer: Buffer | ArrayBuffer | Uint8Array,
  mimeType: string
): Promise<string> {
  const key = `images/inline/${Date.now()}-${filename}`;
  return putBinary(key, buffer, mimeType);
}