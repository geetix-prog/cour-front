"use client";
import { useActionState } from "react";
import Link from "next/link";
import { updateDrop, type UpdateDropState } from "@/lib/actions/drops";
import type { Category, Drop } from "@/lib/api/types";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  drop: Drop;
  categories: Category[];
};

export default function EditDropForm({ drop, categories }: Props) {
  const [state, action, pending] = useActionState(
    updateDrop.bind(null, drop.id),
    {} as UpdateDropState,
  );

  const items = categories.map((category) => ({ value: category.id, label: category.label }));

  return (
    <form action={action} className="flex w-full max-w-xl flex-col gap-5 rounded-lg bg-primary/75 p-6">
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Titre</FieldLabel>
            <Input id="title" name="title" type="text" defaultValue={drop.title} required />
          </Field>
          <Field>
            <FieldLabel htmlFor="content">Contenu</FieldLabel>
            <Input id="content" name="content" type="text" defaultValue={drop.content ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Catégorie</FieldLabel>
            <Select items={items} name="category" defaultValue={drop.category}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="lat">Latitude</FieldLabel>
            <Input id="lat" name="lat" type="number" step="any" defaultValue={drop.location.lat} required />
          </Field>
          <Field>
            <FieldLabel htmlFor="lng">Longitude</FieldLabel>
            <Input id="lng" name="lng" type="number" step="any" defaultValue={drop.location.lng} required />
          </Field>
          <Field>
            <FieldLabel htmlFor="image">Image (URL)</FieldLabel>
            <Input id="image" name="image" type="url" defaultValue={drop.imageUrl ?? ""} />
          </Field>
        </FieldGroup>
      </FieldSet>

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        <Link href={`/drops/${drop.id}`} className="text-sm font-semibold text-white hover:underline">
          Annuler
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-full bg-background px-4 py-2 text-sm font-semibold uppercase transition-all duration-100 ease-in hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
