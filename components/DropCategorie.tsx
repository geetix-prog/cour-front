import { apiGet } from "@/lib/api/client";
import type { Category } from "@/lib/api/types";
import CategoryButtons from "@/components/CategoryButtons";

export default async function DropList() {
  const items = await apiGet<Category[]>("/categories");

  if (items.length === 0) {
    return;
  }

  return <CategoryButtons items={items} />;
}
