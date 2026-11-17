import { apiGet } from "@/lib/api/client";
import type { DropPage } from "@/lib/api/types";

type Props = {
  category: Promise<string | string[] | undefined>;
  q: Promise<string | string[] | undefined>;
};

export default async function DropList(props: Props) {
  const category = await props.category;
  const q = await props.q;

  const params = new URLSearchParams();
  if (typeof category === "string") params.set("category", category);
  if (typeof q === "string" && q !== "") params.set("q", q);

  const { items } = await apiGet<DropPage>(`/drops?${params}`);

  if (items.length === 0) {
    return <p className="text-gray-500">Aucun drop pour le moment.</p>;
  }

  return (
    <ul className="flex w-full flex-col gap-4">
      {items.map((drop) => (
        <li key={drop.id} className="rounded-lg bg-secondary/75 p-4">
          <h2 className="text-lg font-bold text-white">{drop.title}</h2>
          {drop.content && <p className="mt-1 text-white font-thin">{drop.content}</p>}
          <p className="mt-2 text-sm text-white italic">
            par <span className="text-accent">{drop.author.displayName}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}
