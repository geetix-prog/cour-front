"use client";
import { useActionState } from "react";
import { createDropComment } from "@/lib/actions/drops";
import type { ActionState } from "@/lib/api/errors";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  dropId: number;
};

export default function CommentForm({ dropId }: Props) {
  const [state, action, pending] = useActionState(
    createDropComment.bind(null, String(dropId)),
    {} as ActionState,
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <Label htmlFor="comment-content">Ajouter un commentaire</Label>
      <Textarea
        id="comment-content"
        name="content"
        required
        rows={3}
        placeholder="Écris ton commentaire..."
      />
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="self-end">
        {pending ? "Envoi..." : "Commenter"}
      </Button>
    </form>
  );
}
