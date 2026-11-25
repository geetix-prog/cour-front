"use client";
import { useActionState } from "react";
import { replyToComment, type ReplyState } from "@/lib/actions/drops";
import type { Comment } from "@/lib/api/types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  dropId: number;
  parentId: number;
  mention?: string;
  onReplied: (reply: Comment) => void;
  onCancel: () => void;
};

export default function ReplyForm({ dropId, parentId, mention, onReplied, onCancel }: Props) {
  const [state, action, pending] = useActionState(async (prev: ReplyState, form: FormData) => {
    const result = await replyToComment(dropId, parentId, prev, form);
    if (result.comment) onReplied(result.comment);
    return result;
  }, {} as ReplyState);

  const fieldId = `reply-${parentId}`;

  return (
    <form action={action} className="mt-3 flex flex-col gap-2">
      <Label htmlFor={fieldId} className="sr-only">
        Ta réponse
      </Label>
      <Textarea
        key={mention}
        id={fieldId}
        name="content"
        required
        maxLength={500}
        rows={2}
        autoFocus
        defaultValue={mention ? `@${mention} ` : undefined}
        placeholder="Écris ta réponse..."
      />
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Envoi..." : "Répondre"}
        </Button>
      </div>
    </form>
  );
}
