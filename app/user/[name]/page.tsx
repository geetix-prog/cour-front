import ProfilUserDetail from "@/components/ProfilUserDetail"
import { Suspense } from "react"

export default function UsersProfils({ params }: PageProps<"/user/[name]">) {
    const name = params.then((p) => p.name);

    return (
        <div className="mx-10 my-5 flex flex-col items-center space-y-5">
            <h1 className="text-4xl font-bold text-primary">
                Profil de{" "}
                <span className="text-accent">
                    <Suspense fallback="...">{name}</Suspense>
                </span>
            </h1>
            <Suspense fallback={<p className="text-sm text-muted-foreground">Chargement du profil...</p>}>
                <ProfilUserDetail name={name} />
            </Suspense>
        </div>
    )
}
