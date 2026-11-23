import "server-only";
import { apiGet } from "./client";
import type { Category } from "./types";

export async function getCategories() {
  return apiGet<Category[]>("/categories");
}
