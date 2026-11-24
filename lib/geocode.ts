export type Place = {
  id: string;
  name: string;
  context: string;
  lat: number;
  lng: number;
  bounds?: [[number, number], [number, number]];
};

type PhotonFeature = {
  geometry: { coordinates: [number, number] };
  properties: {
    osm_type?: string;
    osm_id?: number;
    name?: string;
    housenumber?: string;
    street?: string;
    postcode?: string;
    city?: string;
    county?: string;
    country?: string;
    extent?: [number, number, number, number];
  };
};

/**
 * Cherche des lieux correspondant à `query`.
 *
 * @param near   Centre actuel de la carte : Photon fait remonter les résultats proches en premier
 *               (taper « gare » propose d'abord celle de Belfort plutôt qu'une gare à Paris).
 * @param signal Permet d'annuler la requête si l'utilisateur a continué à taper entre-temps.
 */
export async function searchPlaces(query: string, near: { lat: number; lng: number } | undefined, signal: AbortSignal) {
  const params = new URLSearchParams({ q: query, limit: "5", lang: "fr" });
  if (near) {
    params.set("lat", String(near.lat));
    params.set("lon", String(near.lng));
  }

  const res = await fetch(`https://photon.komoot.io/api/?${params}`, { signal });
  if (!res.ok) throw new Error(`Recherche indisponible (${res.status})`);
  const data: { features: PhotonFeature[] } = await res.json();

  // On convertit chaque résultat Photon en `Place`, plus simple à afficher.
  return data.features.map((feature, index): Place => {
    const p = feature.properties;
    const [lng, lat] = feature.geometry.coordinates;

    const street = [p.housenumber, p.street].filter(Boolean).join(" ");

    // Nom principal : le nom du lieu s'il en a un, sinon l'adresse, sinon la ville.
    const name = p.name ?? (street || p.city || "Lieu sans nom");

    // Ligne de précision : rue (si le nom est déjà le nom du lieu), code postal + ville, pays.
    const context = [p.name ? street : undefined, [p.postcode, p.city].filter(Boolean).join(" "), p.country]
      .filter((part) => part && part !== name)
      .join(", ");

    return {
      id: `${p.osm_type ?? ""}${p.osm_id ?? index}`,
      name,
      context,
      lat,
      lng,
      bounds: p.extent ? [[p.extent[3], p.extent[0]], [p.extent[1], p.extent[2]]] : undefined,
    };
  });
}
