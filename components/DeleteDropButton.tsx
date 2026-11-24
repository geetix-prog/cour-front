"use client";
import { useActionState } from "react";
import { deleteDrop, type DropState } from "@/lib/actions/drops";

type Props = {
    dropId: number;
};

export default function DeleteCommentButton({ dropId }: Props) {
    const [state, action, pending] = useActionState(
        () => deleteDrop(String(dropId)),
        {} as DropState,
    );

    return (
        <form action={action} className="ml-3 inline-flex items-center gap-2">
        {state?.error && (
            <span role="alert" className="text-xs text-accent">
            {state.error}
            </span>
        )}
            <button
                type="submit"
                disabled={pending}
                aria-label="Supprimer le Drop"
                title="Supprimer le Drop"
                className="self-start cursor-pointer rounded-full bg-background px-4 py-2 text-sm font-semibold uppercase transition-all duration-100 ease-in hover:-translate-y-0.5"
            >
                Supprimer
            </button>
        </form>
    );
}
