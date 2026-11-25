import { getMe } from "@/lib/api/user";
import ProfilForm from "./ProfilForm";
import DropList from "../../drops/list/DropList";

type Props = {
  page?: Promise<string | string[] | undefined>;
};

export default async function ProfilDetail({ page }: Props) {
  const user = await getMe();
  return (
    <div className="flex space-x-5 w-full">
      <div className="w-1/2 sticky">
        <ProfilForm user={user} />
      </div>
      <div className="w-1/2">
        <DropList author={user.username} page={page} />
      </div>
    </div>
  )
}
