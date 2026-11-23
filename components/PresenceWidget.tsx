"use client";

import { usePresence } from "@/lib/hooks/use-presence";
import ViewerStack from "./ViewerStack";

type Props = {
    dropId: number;
};

export default function PresenceWidget({ dropId }: Props) {
    const viewers = usePresence(dropId);
    return <ViewerStack users={viewers} />;
}
