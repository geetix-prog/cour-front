import ProfilDetail from "@/components/ProfilDetail"
import { Suspense } from "react"

export default function Profil() {
    return (
        <div>
            <Suspense fallback={<p>Chargement de votre profil...</p>}>
                <ProfilDetail />
            </Suspense>
        </div>
    )
};