"use client";
import { useActionState } from "react";
import { deleteDrop } from "@/lib/actions/drops";
import type { ActionState } from "@/lib/api/errors";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  dropId: number;
};

export default function DeleteDropButton({ dropId }: Props) {
  const [state, action, pending] = useActionState(
    () => deleteDrop(String(dropId)),
    {} as ActionState,
  );

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Supprimer ce drop ? Cette action est définitive.")) e.preventDefault();
      }}
      className="inline-flex items-center gap-2"
    >
      <button type="submit" disabled={pending} className={buttonVariants({ variant: "destructive", size: "sm" })}>
        {pending ? "Suppression..." : "Supprimer"}
      </button>
      {state?.error && (
        <span role="alert" className="text-xs text-destructive">
          {state.error}
        </span>
      )}
    </form>
  );
}
