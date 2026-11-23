import type { PublicUser } from "@/lib/api/types";

type Props = {
  users: PublicUser[];
  max?: number;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function ViewerStack({ users, max = 4 }: Props) {
  if (users.length === 0) return null;

  const visible = users.slice(0, max);
  const hidden = users.length - visible.length;
  const label = `${users.length} personne${users.length > 1 ? "s" : ""} regarde${users.length > 1 ? "nt" : ""} ce drop`;

  return (
    <div className="flex items-center gap-2" aria-label={label}>
      <ul className="flex -space-x-2">
        {visible.map((user) => (
          <li
            key={user.id}
            title={user.displayName}
            className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-accent text-xs font-semibold text-accent-foreground ring-2 ring-background"
          >
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- avatars externes, hôtes inconnus
              <img src={user.avatarUrl} alt={user.displayName} className="size-full object-cover" />
            ) : (
              <span aria-hidden="true">{initials(user.displayName)}</span>
            )}
          </li>
        ))}
        {hidden > 0 && (
          <li
            title={users.slice(max).map((user) => user.displayName).join(", ")}
            className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground ring-2 ring-background"
          >
            +{hidden}
          </li>
        )}
      </ul>
      <span className="text-sm text-white/70 italic">
        {users.length > 1 ? `${users.length} en train de regarder` : "1 en train de regarder"}
      </span>
    </div>
  );
}
