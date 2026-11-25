"use client";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/lib/api/types";

type Props = { items: Category[] };

export default function CategoryButtons({ items }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category");

  function handleSelect(categoryId: string | null) {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    if (categoryId) params.set("category", categoryId);
    else params.delete("category");
    router.push(`/drops?${params}`);
  }

  const options = [{ id: null, label: "Toutes" }, ...items];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-primary">Catégorie</p>
      <ul className="flex flex-wrap gap-2 lg:flex-col">
        {options.map((category) => {
          const selected = active === category.id || (!active && category.id === null);
          return (
            <li key={category.id ?? "all"}>
              <button
                type="button"
                onClick={() => handleSelect(category.id)}
                aria-pressed={selected}
                className={`w-full cursor-pointer rounded-lg border px-4 py-2 text-left text-sm font-semibold transition-all duration-100 ease-in hover:-translate-y-0.5 ${
                  selected
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border bg-card text-primary hover:border-primary/40"
                }`}
              >
                {category.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
