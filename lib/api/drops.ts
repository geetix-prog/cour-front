import "server-only";
import { apiGet } from "./client";
import type { CommentPage, Drop, DropPage } from "./types";
import { requireSession } from "../session";

export async function getDrop(dropId: string | number) {
  await requireSession();
  return apiGet<Drop>(`/drops/${dropId}`);
}

export async function getDropComments(dropId: string | number) {
  await requireSession();
  return apiGet<CommentPage>(`/drops/${dropId}/comments`);
}

export async function getCommentReplies(commentId: number, page = 1) {
  await requireSession();
  return apiGet<CommentPage>(`/comments/${commentId}/replies?page=${page}&pageSize=20`);
}

export async function getDrops(page?: number, params?: URLSearchParams, author?: string) {
  await requireSession();
  const query = new URLSearchParams(params);
  query.set("page", String(page));
  query.set("pageSize", "20");
  if (author) query.set("author", author);
  return apiGet<DropPage>(`/drops?${query}`);
}
