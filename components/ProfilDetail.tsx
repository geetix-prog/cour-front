import { getMe } from "@/lib/api/user";
import ProfilForm from "./ProfilForm";
import DropList from "./DropList";

export default async function ProfilDetail() {
  const user = await getMe();
  return (
    <div className="flex space-x-5 w-full">
      <div className="w-1/2 sticky">
        <ProfilForm user={user} />
      </div>
      <div className="w-1/2">
        <DropList author={user.username} />
      </div>
    </div>
  )
}
