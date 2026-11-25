"use client";

import { Suspense, useActionState } from "react";
import { login, register } from "@/lib/actions/auth";
import type { ActionState } from "@/lib/api/errors";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SessionExpiredNotice from "@/components/interface/SessionExpiredNotice";

export default function Auth() {
  const [loginState, loginAction, loginPending] = useActionState(login, {} as ActionState);
  const [registerState, registerAction, registerPending] = useActionState(register, {} as ActionState);


  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-2">
      <Suspense>
        <SessionExpiredNotice />
      </Suspense>

      <section className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-primary">Connexion</h1>
        <p className="mt-1 text-sm text-muted-foreground">Content de te revoir.</p>

        <form action={loginAction} className="mt-6 flex flex-col gap-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="login">Nom d&apos;utilisateur ou email</FieldLabel>
              <Input
                id="login"
                name="login"
                type="text"
                autoComplete="username"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </Field>
          </FieldGroup>

          {loginState.error && (
            <p role="alert" className="text-sm text-destructive">
              {loginState.error}
            </p>
          )}

          <Button type="submit" disabled={loginPending} className="self-start">
            {loginPending ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </section>

      <section className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-primary">Inscription</h2>
        <p className="mt-1 text-sm text-muted-foreground">Crée ton compte pour poser tes premiers drops.</p>

        <form action={registerAction} className="mt-6 flex flex-col gap-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Nom d&apos;utilisateur</FieldLabel>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="displayName">Nom affiché</FieldLabel>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bio">Bio</FieldLabel>
              <Textarea id="bio" name="bio" rows={3} />
            </Field>
            <Field>
              <FieldLabel htmlFor="registerPassword">Mot de passe</FieldLabel>
              <Input
                id="registerPassword"
                name="registerPassword"
                type="password"
                autoComplete="new-password"
                required
              />
              <FieldDescription>Au moins 4 caractères.</FieldDescription>
            </Field>
          </FieldGroup>

          {registerState.error && (
            <p role="alert" className="text-sm text-destructive">
              {registerState.error}
            </p>
          )}

          <Button type="submit" variant="secondary" disabled={registerPending} className="self-start">
            {registerPending ? "Inscription..." : "S'inscrire"}
          </Button>
        </form>
      </section>
    </div>
  );
}
