"use client";
import { useActionState } from "react";
import { updateProfile, type UpdateProfileState } from "@/lib/actions/user";
import type { PrivateUser } from "@/lib/api/types";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  user: PrivateUser;
};

export default function ProfilForm({ user }: Props) {
  const [state, action, pending] = useActionState(updateProfile, {} as UpdateProfileState);

  return (
    <form action={action} className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-4">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- avatars externes, hôtes inconnus
          <img className="size-16 rounded-full object-cover ring-2 ring-accent" src={user.avatarUrl} alt="Photo de profil" />
        ) : (
          <div className="size-16 rounded-full bg-accent" aria-hidden="true" />
        )}
        <div>
          <p className="text-xl font-bold text-primary">{user.displayName}</p>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="displayName">Nom affiché</FieldLabel>
          <Input id="displayName" name="displayName" type="text" required defaultValue={user.displayName} />
        </Field>
        <Field>
          <FieldLabel htmlFor="avatarUrl">Photo de profil (URL)</FieldLabel>
          <Input id="avatarUrl" name="avatarUrl" type="url" placeholder="https://..." defaultValue={user.avatarUrl ?? ""} />
        </Field>
        <Field>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <Textarea id="bio" name="bio" rows={4} defaultValue={user.bio ?? ""} />
        </Field>
      </FieldGroup>

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state.success && !pending && (
        <p role="status" className="text-sm text-accent">
          Profil mis à jour.
        </p>
      )}

      <Button type="submit" disabled={pending} className="self-end">
        {pending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
