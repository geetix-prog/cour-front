import type { Profile } from "@/lib/api/types";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
    user: Profile;
};

const readOnlyClass = "cursor-default focus-visible:border-input focus-visible:ring-0";

export default function ProfilUser({ user }: Props) {
    return (
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-4">
            {user.avatarUrl ? (
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
                <Input id="displayName" type="text" readOnly value={user.displayName} className={readOnlyClass} />
            </Field>
            <Field>
                <FieldLabel htmlFor="avatarUrl">Photo de profil (URL)</FieldLabel>
                <Input id="avatarUrl" type="url" readOnly value={user.avatarUrl ?? ""} placeholder="Aucune" className={readOnlyClass} />
            </Field>
            <Field>
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <Textarea id="bio" rows={4} readOnly value={user.bio ?? ""} placeholder="Aucune bio" className={readOnlyClass} />
            </Field>
        </FieldGroup>
        </div>
    );
}
