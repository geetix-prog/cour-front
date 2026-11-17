import { Suspense } from "react";

export default function StatusPage() {
  return (
    <Suspense fallback={<p>Vérification...</p>}>
      <Health />
    </Suspense> 
  )
}

async function Health() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
  return <p>{res.ok ? 'API en ligne' : 'API hors ligne'}</p>
} 