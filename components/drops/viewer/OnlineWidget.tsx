"use client";

import { useOnline } from "@/lib/hooks/use-online";
import ViewerOnline from "@/components/interface/ViewerOnline";

export default function OnlineWidget() {
    const users = useOnline();
    return <ViewerOnline users={users} />;
}
