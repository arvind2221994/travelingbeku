"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { deleteBlogPost } from "@/actions/blog-actions";
import { formatDate } from "@/lib/utils";
import type { BlogPostMeta } from "@/types";
import {
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface BlogTileProps {
  post: BlogPostMeta;
}

export function BlogTile({ post }: BlogTileProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      // Reset confirmation after 3 s
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    startTransition(async () => {
      await deleteBlogPost(post.id);
      router.refresh();
    });
  };

  return (
    <article className="glass rounded-2xl overflow-hidden group hover:border-white/15 transition-all duration-300">
      {/* Cover thumbnail */}
      <div className="relative aspect-[16/7] bg-neutral-800 overflow-hidden">
        {post.image_url ? (
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-20">
            🌍
          </div>
        )}

        {/* Published badge */}
        <div className="absolute top-2 right-2">
          {post.published ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Eye size={8} />
              Live
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-500/20 text-neutral-400 border border-neutral-500/30">
              <EyeOff size={8} />
              Draft
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 mb-1">
          {post.title}
        </h3>
        <p className="text-[11px] text-neutral-500 mb-4">
          {formatDate(post.created_at)}
          {post.categories.length > 0 &&
            ` · ${post.categories.slice(0, 2).join(", ")}`}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/edit/${post.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/5 text-neutral-300 hover:text-black transition-colors font-medium"
          >
            <Edit2 size={11} />
            Edit
          </Link>

          {post.published && (
            <Link
              href={`/blogs/${post.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/5 text-neutral-300 hover:text-black transition-colors"
            >
              <ExternalLink size={11} />
              View
            </Link>
          )}

          <button
            onClick={handleDelete}
            disabled={isPending}
            className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors font-medium ${confirming
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
              : "bg-white/5 text-neutral-500 hover:bg-red-500/10 hover:text-red-400"
              } disabled:opacity-50`}
          >
            {isPending ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Trash2 size={11} />
            )}
            {confirming ? "Confirm?" : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}
