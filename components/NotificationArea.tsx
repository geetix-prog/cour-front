import { cookies } from "next/headers";
import NotificationBell from "./NotificationBell";

export default async function NotificationArea() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;

  return <NotificationBell />;
}
