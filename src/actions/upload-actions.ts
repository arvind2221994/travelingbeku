"use server";

import { uploadInlineImage } from "@/lib/r2";
import { auth } from "@/lib/auth";

/**
 * Called by the Tiptap image drop handler.
 * Uploads the image to R2 and returns the public URL
 * so Tiptap can embed it directly in the editor content.
 */
export async function uploadEditorImage(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { ok: false, error: "No file provided" };

  const maxSize = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxSize) return { ok: false, error: "File too large (max 10 MB)" };

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) return { ok: false, error: "Unsupported image type" };

  const buffer = new Uint8Array(await file.arrayBuffer());
  const url = await uploadInlineImage(file.name, buffer, file.type);

  return { ok: true, url };
}
