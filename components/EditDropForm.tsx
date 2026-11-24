"use client";
import { useActionState } from "react";
import Link from "next/link";
import { updateDrop, type UpdateDropState } from "@/lib/actions/drops";
import type { Category, Drop } from "@/lib/api/types";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
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
    <form action={action} className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:p-8">
        <FieldGroup>
          <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="title">Titre</FieldLabel>
            <Input id="title" name="title" type="text" defaultValue={drop.title} required />
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
          </div>
          <Field>
            <FieldLabel htmlFor="content">Contenu</FieldLabel>
            <Textarea id="content" name="content" rows={4} defaultValue={drop.content ?? ""} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="lat">Latitude</FieldLabel>
            <Input id="lat" name="lat" type="number" step="any" defaultValue={drop.location.lat} required />
          </Field>
          <Field>
            <FieldLabel htmlFor="lng">Longitude</FieldLabel>
            <Input id="lng" name="lng" type="number" step="any" defaultValue={drop.location.lng} required />
          </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="image">Image (URL)</FieldLabel>
            <Input id="image" name="image" type="url" placeholder="https://..." defaultValue={drop.imageUrl ?? ""} />
          </Field>
        </FieldGroup>

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        <Link href={`/drops/${drop.id}`} className={buttonVariants({ variant: "ghost" })}>
          Annuler
        </Link>
        <Button type="submit" disabled={pending}>
          {pending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
