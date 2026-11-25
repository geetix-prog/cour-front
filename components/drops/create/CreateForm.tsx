"use client";
import { use, useActionState, useState } from "react";
import { createDrop } from "@/lib/actions/drops";
import type { ActionState } from "@/lib/api/errors";
import type { Category } from "@/lib/api/types";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddMapPoint, { type LatLng } from "@/components/maps/AddMapPoint";

type Props = {
  categories: Promise<Category[]>;
};

export default function CreateForm(props: Props) {
  const [state, action, pending] = useActionState(createDrop, {} as ActionState);
  const categories = use(props.categories);
  const items = categories.map((category) => ({ value: category.id, label: category.label }));

  const [coords, setCoords] = useState({ lat: "", lng: "" });

  const lat = Number.parseFloat(coords.lat);
  const lng = Number.parseFloat(coords.lng);
  const position: LatLng | null = Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;

  function handleMapClick(next: LatLng) {
    setCoords({ lat: String(next.lat), lng: String(next.lng) });
  }


  return (
    <form action={action} className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:p-8">
      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="title">Titre</FieldLabel>
            <Input id="title" name="title" type="text" required />
          </Field>
          <Field>
            <FieldLabel>Catégorie</FieldLabel>
            <Select items={items} name="category" defaultValue={categories[0]?.id}>
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
          <Textarea id="content" name="content" rows={4} required />
        </Field>
        <Field>
          <FieldLabel>Position</FieldLabel>
          <AddMapPoint value={position} onChange={handleMapClick} />
          <FieldDescription>
            Clique sur la carte pour placer le drop, ou saisis les coordonnées. Laisse vide pour la position par défaut.
          </FieldDescription>
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="lat">Latitude</FieldLabel>
            <Input
              id="lat"
              name="lat"
              type="number"
              step="any"
              placeholder="47.49561"
              value={coords.lat}
              onChange={(e) => setCoords((c) => ({ ...c, lat: e.target.value }))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="lng">Longitude</FieldLabel>
            <Input
              id="lng"
              name="lng"
              type="number"
              step="any"
              placeholder="6.80544"
              value={coords.lng}
              onChange={(e) => setCoords((c) => ({ ...c, lng: e.target.value }))}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="image">Image (URL)</FieldLabel>
          <Input
            id="image"
            name="image"
            type="url"
            placeholder="https://..."
          />
        </Field>
      </FieldGroup>

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="self-end">
        {pending ? "Création..." : "Créer le drop"}
      </Button>
    </form>
  );
}
