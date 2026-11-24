import type { Category } from "@/lib/api/types";
import { getCategories } from "@/lib/api/categories";
import CategoryButtons from "@/components/CategoryButtons";

export default async function DropCategorie() {
  const items: Category[] = await getCategories();
  if (items.length === 0) return null;

  return <CategoryButtons items={items} />;
}
