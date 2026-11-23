"use client";
import { useActionState } from "react";
import { updateProfile, type UpdateProfileState } from "@/lib/actions/user";
import type { PrivateUser } from "@/lib/api/types";

type Props = {
  user: PrivateUser;
};

export default function ProfilForm({ user }: Props) {
  const [state, action, pending] = useActionState(updateProfile, {} as UpdateProfileState);

  return (
    <form action={action} className="w-1/3 bg-primary space-y-5 p-5 rounded-lg">
      <div className="flex items-center gap-4">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- avatars externes, hôtes inconnus
          <img className="size-15 rounded-full border-2 border-black object-cover" src={user.avatarUrl} alt="Photo de profil" />
        ) : (
          <div className="size-15 rounded-full border-2 border-black bg-accent" aria-hidden="true" />
        )}
        <div>
          <p className="font-bold text-accent">{user.displayName}</p>
          <p className="text-sm text-background">@{user.username}</p>
        </div>
      </div>

      <div className="flex flex-col -space-y-3">
        <label htmlFor="displayName" className="self-start text-accent ml-3 px-1 bg-primary z-10">Nom affiché</label>
        <div className="w-full border border-accent rounded-lg p-3">
          <input
            id="displayName"
            name="displayName"
            type="text"
            required
            defaultValue={user.displayName}
            className="text-background w-full outline-none border-none bg-transparent"
          />
        </div>
      </div>

      <div className="flex flex-col -space-y-3">
        <label htmlFor="avatarUrl" className="self-start text-accent ml-3 px-1 bg-primary z-10">Photo de profil (URL)</label>
        <div className="w-full border border-accent rounded-lg p-3">
          <input
            id="avatarUrl"
            name="avatarUrl"
            type="url"
            placeholder="https://..."
            defaultValue={user.avatarUrl ?? ""}
            className="text-background w-full outline-none border-none bg-transparent placeholder:text-background/50"
          />
        </div>
      </div>

      <div className="flex flex-col -space-y-3">
        <label htmlFor="bio" className="self-start text-accent ml-3 px-1 bg-primary z-10">Bio</label>
        <div className="w-full border border-accent rounded-lg p-3">
          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={user.bio ?? ""}
            className="text-background w-full outline-none border-none bg-transparent resize-none"
          />
        </div>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state.success && !pending && (
        <p role="status" className="text-sm text-background">
          Profil mis à jour.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="text-primary bg-background px-3 py-2 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Enregistrement..." : "Modifier"}
      </button>
    </form>
  );
}
