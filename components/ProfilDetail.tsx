import { getMe } from "@/lib/api/user";
import ProfilForm from "./ProfilForm";

export default async function ProfilDetail() {
  const user = await getMe();
  return <ProfilForm user={user} />;
}
