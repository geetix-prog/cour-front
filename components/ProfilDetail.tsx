import { getMe } from "@/lib/api/user";
import ProfilForm from "./ProfilForm";

export default async function ProfilDetail() {
    const user = await getMe();

    return (
        <div className="w-full items-center justify-center flex flex-col">
            <ProfilForm user={user} />
        </div>
    );
}
