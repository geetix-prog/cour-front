import { apiGet } from "@/lib/api/client";
import type { DropPage } from "@/types/api";

export default async function DropList() {
  const { items } = await apiGet<DropPage>('/drops');

  if (items.length === 0) {
    return <p className="text-gray-500">Aucun drop pour le moment.</p>;
  }

  return (
    <ul className="flex w-full max-w-xl flex-col gap-4">
      {items.map((drop) => (
        <li key={drop.id} className="rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold">{drop.title}</h2>
          {drop.content && <p className="mt-1 text-gray-700">{drop.content}</p>}
          <p className="mt-2 text-sm text-gray-500">par {drop.author.displayName}</p>
        </li>
      ))}
    </ul>
  );
}
