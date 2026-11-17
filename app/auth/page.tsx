"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/actions/auth";

const initialState: LoginState = {};

export default function Auth() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <div className="flex items-center gap-6 h-screen w-full p-5">
      <div className="bg-primary rounded-lg space-y-5 w-full h-full flex flex-col items-center pt-5">
        <h2 className="text-white font-bold text-4xl">Connexion</h2>
        <form action={action} className="w-full flex flex-col items-center space-y-5 justify-center">
          <input className="bg-accent rounded-full w-1/2 text-background p-3" type="text" name="login" placeholder="Nom d'utilisateur" autoComplete="username" required />
          <input className="bg-accent rounded-full w-1/2 text-background p-3" type="password" name="password" placeholder="Mot de passe" autoComplete="current-password" required />
          {state?.error && <p role="alert">{state.error}</p>}
          <button type="submit" disabled={pending} className="bg-background rounded-full px-3 py-2 font-semibold text-sm cursor-pointer hover:-translate-y-0.5 transition-all duration-100 ease-in uppercase disabled:cursor-not-allowed disabled:opacity-50">
            {pending ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
      <div className="bg-primary rounded-lg space-y-5 w-full h-full flex flex-col items-center pt-5">
        <h2 className="text-white font-bold text-4xl">Inscription</h2>
        <form action="" className="w-full flex flex-col items-center space-y-5 justify-center">
          <input className="bg-accent rounded-full w-1/2 text-background p-3" type="text" name="username" placeholder="Nom d'utilisateur" id="" />
          <input className="bg-accent rounded-full w-1/2 text-background p-3" type="text" name="password" placeholder="Mot de passe" id="" />
          <button type="submit" className="bg-background rounded-full px-3 py-2 font-semibold text-sm cursor-pointer hover:-translate-y-0.5 transition-all duration-100 ease-in uppercase">
            Inscription
          </button>
        </form>
      </div>
    </div>
  );
}
