import { getUser } from "@/lib/api/user"
import ProfilUser from "./ProfilUser";
import DropList from "./DropList";

interface Props {
    name: Promise<string>,
    page?: Promise<string | string[] | undefined>,
}

export default async function ProfilUserDetail(props: Props) {
    const name = await props.name;
    const user = await getUser(name);
    return (
        <div className="flex space-x-5 w-full">
            <div className="w-1/2 sticky">
                <ProfilUser user={user} />
            </div>
            <div className="w-1/2">
                <DropList author={user.username} page={props.page} />
            </div>
        </div>
    )
    }