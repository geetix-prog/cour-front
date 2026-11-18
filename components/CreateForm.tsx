"use client";
import { use, useActionState } from "react";
import { createDrop, type createDropState } from "@/lib/actions/drops";
import type { Category } from "@/lib/api/types";

type Props = {
  categories: Promise<Category[]>;
};

export default function CreateForm(props: Props) {
  const [state, action, pending] = useActionState(createDrop, {} as createDropState);

  const categories = use(props.categories);

  return (
    <form action={action} className="w-full flex flex-col items-center space-y-5 justify-center">
      <input className="bg-accent rounded-full w-1/2 text-background p-3" type="text" name="title" placeholder="Titre" autoComplete="title" required />
      <input className="bg-accent rounded-full w-1/2 text-background p-3" type="text" name="content" placeholder="Contenu" autoComplete="content" required />
      <select name="category" id="">
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.label}</option>
        ))}
      </select>
      <input className="bg-accent rounded-full w-1/2 text-background p-3" type="number" step="any" name="lat" placeholder="Lattitude" autoComplete="lat" required />
      <input className="bg-accent rounded-full w-1/2 text-background p-3" type="number" step="any" name="lng" placeholder="Longittude" autoComplete="lng" required />
      {state?.error && (
        <p role="alert" className="text-accent">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="bg-background rounded-full px-3 py-2 font-semibold text-sm cursor-pointer hover:-translate-y-0.5 transition-all duration-100 ease-in uppercase disabled:cursor-not-allowed disabled:opacity-50">
        {pending ? "Création..." : "Créer"}
      </button>
    </form>
  );
}
