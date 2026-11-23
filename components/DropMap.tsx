"use client";
import { useEffect, useRef } from "react";
import "leaflet/styles.css";

type Props = {
  lat: number;
  lng: number;
  title: string;
  approx?: boolean;
};

export default function DropMap({ lat, lng, title, approx = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    // Import dynamique : Leaflet a besoin de `window`, il ne doit jamais être chargé côté serveur.
    import("leaflet").then(({ LeafletMap, TileLayer, Marker, Circle }) => {
      if (cancelled) return;

      const map = new LeafletMap(container).setView([lat, lng], approx ? 14 : 16);

      new TileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      if (approx) {
        new Circle([lat, lng], { radius: 300 }).addTo(map).bindPopup(`${title} (position approximative)`);
      } else {
        new Marker([lat, lng]).addTo(map).bindPopup(title);
      }

      cleanup = () => map.remove();
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [lat, lng, title, approx]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={`Carte : ${title}`}
      className="isolate h-72 w-full overflow-hidden rounded-lg"
    />
  );
}
