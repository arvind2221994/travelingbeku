"use server";

/**
 * blog-actions.ts — Server Action Wrappers
 * This file acts as the entry point for the client, while logic lives in blog-logic.ts.
 */

import { savePostLogic, deletePostLogic } from "@/lib/blog-logic";
import { auth } from "@/lib/auth";

/** Guard helper — throws if not authenticated */
async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

export async function saveBlogPost(formData: FormData) {
  await requireAdmin();
  return savePostLogic(formData);
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  return deletePostLogic(id);
}
