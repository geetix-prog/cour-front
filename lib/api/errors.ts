import "server-only";
import { unstable_rethrow } from "next/navigation";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly fields: Record<string, string[]> = {},
  ) {
    super(message);
  }
}

const messages: Record<number, string> = {
  0: "Impossible de joindre le serveur. Vérifie ta connexion.",
  400: "La requête est invalide.",
  401: "Identifiant ou mot de passe incorrect.",
  403: "Tu n'as pas le droit de faire ça.",
  404: "Ce contenu n'existe plus.",
  409: "Cette ressource existe déjà.",
  422: "Le formulaire contient des erreurs.",
  429: "Trop de requêtes, réessaie dans quelques secondes.",
};

export type ActionState = { error?: string; success?: boolean };

export function actionError(error: unknown): ActionState {
  unstable_rethrow(error);

  if (!(error instanceof ApiError)) {
    console.error(error);
    return { error: "Une erreur est survenue, réessaie plus tard." };
  }

  const message = messages[error.status] ?? "Le serveur a rencontré un problème, réessaie plus tard.";
  const details = Object.values(error.fields).flat();
  return { error: details.length > 0 ? `${message} ${details.join(" ")}` : message };
}
