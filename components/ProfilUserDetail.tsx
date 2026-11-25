import { getUser } from "@/lib/api/user"
import ProfilUser from "./ProfilUser";

interface Props {
    name: Promise<string>,
}

export default async function ProfilUserDetail(props: Props) {
    const name = await props.name;
    const user = await getUser(name);
    return (
        <div>
            <ProfilUser user={user}/>
            
        </div>
    )
    }