import ProfilUserDetail from "@/components/ProfilUserDetail"
import { Suspense } from "react"

export default function UsersProfils({ params }: PageProps<"/user/[name]">) {
    const name = params.then((p) => p.name);

    return (
        <Suspense fallback={'Chargement du profil...'}>
            <ProfilUserDetail name={name} />
        </Suspense>
    )
}