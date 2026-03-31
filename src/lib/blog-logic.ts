import {
  upsertPost,
  deletePost,
  uploadCoverImage,
  getPostById,
} from "@/lib/r2";
import { slugify, stripHtml } from "@/lib/utils";
import type { BlogPost } from "@/types";

// ─── Blog Management Logic (Edge Compatible) ──────────────────────────────────

export async function savePostLogic(formData: FormData) {
  const id = (formData.get("id") as string) || crypto.randomUUID();
  const title = formData.get("title") as string;
  const rawSlug = formData.get("slug") as string;
  const slug = rawSlug ? slugify(rawSlug) : slugify(title);
  const content = formData.get("content") as string;
  const excerpt =
    (formData.get("excerpt") as string) || stripHtml(content, 160);
  const categoriesRaw = formData.get("categories") as string;
  const categories = categoriesRaw
    ? categoriesRaw.split(",").map((c) => c.trim()).filter(Boolean)
    : [];
  const published = formData.get("published") === "true";

  // Fetch existing post (if editing) for image_url fallback
  const existing = await getPostById(id);
  let image_url = existing?.image_url ?? "";

  // Handle cover image upload
  const coverFile = formData.get("coverFile") as File | null;
  if (coverFile && coverFile.size > 0) {
    // 💡 Fix: Using Uint8Array instead of Buffer for pure Edge compatibility
    const buffer = new Uint8Array(await coverFile.arrayBuffer());
    image_url = await uploadCoverImage(slug, buffer, coverFile.type);
  }

  const now = new Date().toISOString();
  const post: BlogPost = {
    id,
    slug,
    title,
    excerpt,
    content,
    image_url,
    categories,
    published,
    created_at: existing?.created_at ?? now,
    updated_at: now,
  };

  await upsertPost(post);
  return { ok: true, slug };
}

export async function deletePostLogic(id: string) {
  const result = await deletePost(id);
  return { ok: result };
}
