import type { PublicUser } from "@/lib/api/types";

type Props = {
  users: PublicUser[];
};

export default function ViewerOnline({ users }: Props) {
  if (users.length === 0) return null;

  return (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
      {users.length} en ligne
    </p>
  );
}
