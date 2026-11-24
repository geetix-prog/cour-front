import type { PublicUser } from "@/lib/api/types";

type Props = {
    users: PublicUser[];
};

export default function ViewerOnline({ users }: Props) {
    if (users.length === 0) return null;

    const nbr = users.length;

    return (
        <div>
            <p className="text-accent">En ligne : {nbr}</p>
        </div>
    );
}
