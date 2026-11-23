"use client";
import { use, useActionState } from "react";
import { createDrop, type createDropState } from "@/lib/actions/drops";
import type { Category } from "@/lib/api/types";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  categories: Promise<Category[]>;
};

export default function CreateForm(props: Props) {
  const [state, action, pending] = useActionState(createDrop, {} as createDropState);

  const categories = use(props.categories);

  const items = categories.map((category) => ({ value: category.id, label: category.label }))

  return (
    <form action={action} className="w-1/2 flex flex-col bg-primary items-center space-y-5 justify-center">
      <FieldSet className="w-1/2">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Titre</FieldLabel>
            <Input name="title" type="text" placeholder="Titre" required />
            <FieldDescription>
              Entrez le titre
            </FieldDescription>
            {state.error && <FieldError>Titre incorrect</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="content">Contenu</FieldLabel>
            <Input name="content" type="text" placeholder="Contenu" required />
            <FieldDescription>
              Entrez le contenu
            </FieldDescription>
            {state.error && <FieldError>Contenu incorrect</FieldError>}
          </Field>
          <Select
            items={items}
            name="category"
            defaultValue={categories[0]?.id}
          >
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
          <Field>
            <FieldLabel htmlFor="lat">Lattitude</FieldLabel>
            <Input name="lat" type="text" placeholder="Lattitude" />
            <FieldDescription>
              Entrez la lattitude
            </FieldDescription>
            {state.error && <FieldError>Lattitude incorrect</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="lng">Longittude</FieldLabel>
            <Input name="lng" type="text" placeholder="Longittude" />
            <FieldDescription>
              Entrez la longittude
            </FieldDescription>
            {state.error && <FieldError>Longittude incorrect</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="image">Image</FieldLabel>
            <Input name="image" type="text" placeholder="Image" required />
            <FieldDescription>
              Entrez l'image
            </FieldDescription>
            {state.error && <FieldError>Image incorrect</FieldError>}
          </Field>
        </FieldGroup>
      </FieldSet>
      {state.error && <p role="alert" className="text-destructive text-sm">{state.error}</p>}
      <button type="submit" disabled={pending} className="bg-background rounded-full px-3 py-2 font-semibold text-sm cursor-pointer hover:-translate-y-0.5 transition-all duration-100 ease-in uppercase disabled:cursor-not-allowed disabled:opacity-50">
        {pending ? "Création..." : "Créer"}
      </button>
    </form>
  );
}
