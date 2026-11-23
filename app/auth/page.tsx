"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/actions/auth";
import { register, type RegisterState } from "@/lib/actions/auth";
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

const initialState: LoginState = {};
const registerInitialState: RegisterState = {};

export default function Auth() {
  const [state, action, pending] = useActionState(login, initialState);
  const [registerState, registerAction, registerPending] = useActionState(register, registerInitialState);
  
  return (
    <div className="flex items-center gap-6 h-screen w-full p-5">
      <div className="bg-primary rounded-lg space-y-5 w-full h-full flex flex-col items-center pt-5">
        <h2 className="text-white font-bold text-4xl">Connexion</h2>
        <form action={action} className="w-full flex flex-col items-center space-y-5 justify-center">
          {/* <input className="bg-accent rounded-full w-1/2 text-background p-3" type="text" name="login" placeholder="Nom d'utilisateur" autoComplete="username" required />
          <input className="bg-accent rounded-full w-1/2 text-background p-3" type="password" name="password" placeholder="Mot de passe" autoComplete="current-password" required />
          {state?.error && <p role="alert" className="text-accent">{state.error}</p>} */}
          <FieldSet className="w-full max-w-xs">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input name="login" type="text" placeholder="username" required />
                <FieldDescription>
                  Entrez votre nom d'utilisateur.
                </FieldDescription>
                {state.error && <FieldError>Nom incorrect</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input name="password" type="password" placeholder="••••••••" required />
                <FieldDescription>
                  Doit être suppérieur à 4 caractères
                </FieldDescription>
                {state.error && <FieldError>Mot de passe incorrect</FieldError>}
              </Field>
            </FieldGroup>
          </FieldSet>
          <button type="submit" disabled={pending} className="bg-background rounded-full px-3 py-2 font-semibold text-sm cursor-pointer hover:-translate-y-0.5 transition-all duration-100 ease-in uppercase disabled:cursor-not-allowed disabled:opacity-50">
            {pending ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
      <div className="bg-primary rounded-lg space-y-5 w-full h-full flex flex-col items-center pt-5">
        <h2 className="text-white font-bold text-4xl">Inscription</h2>
        <form action={ registerAction } className="w-full flex flex-col items-center space-y-5 justify-center">
          <FieldSet className="w-full max-w-xs">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input name="username" type="text" placeholder="Nom d'utilisateur" required />
                <FieldDescription>
                  Entrez votre nom d'utilisateur.
                </FieldDescription>
                {registerState.error && <FieldError>Nom incorrect</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input name="email" type="email" placeholder="Email" required />
                <FieldDescription>
                  Entrez votre adresse email.
                </FieldDescription>
                {registerState.error && <FieldError>Email incorrect</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="displayName">Nom affiché</FieldLabel>
                <Input name="displayName" type="text" placeholder="Nom affiché" required />
                <FieldDescription>
                  Entrez le nom affiché.
                </FieldDescription>
                {registerState.error && <FieldError>Nom incorrect</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <Input name="bio" type="text" placeholder="Bio" required />
                <FieldDescription>
                  Entrez votre bio.
                </FieldDescription>
                {registerState.error && <FieldError>Bio incorrect</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input name="registerPassword" type="password" placeholder="••••••••" />
                <FieldDescription>
                  Doit être suppérieur à 4 caractères
                </FieldDescription>
                {registerState.error && <FieldError>Mot de passe incorrect</FieldError>}
              </Field>
            </FieldGroup>
          </FieldSet>
          <button type="submit" disabled={registerPending} className="bg-background rounded-full px-3 py-2 font-semibold text-sm cursor-pointer hover:-translate-y-0.5 transition-all duration-100 ease-in uppercase">
            {registerPending ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}
