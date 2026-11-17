"use client";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/api/types";

type Props = { items: Category[] };

export default function CategoryButtons({ items }: Props) {
  const router = useRouter();

  function handleSelect(categoryId: string) {
    router.push(`/drops?category=${categoryId}`);
  }

  return (
    <ul className="flex flex-col justify-between w-full gap-4">
      <span>Catégorie :</span>
      {items.map((category) => (
        <button onClick={() => handleSelect(category.id)} key={category.id} className="rounded-lg bg-secondary text-white font-semibold hover:-translate-y-0.5 cursor-pointer transition-duration duration-100 ease-in p-4">
          <p>{category.label}</p>
        </button>
      ))}
    </ul>
  );
}
