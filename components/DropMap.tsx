"use client";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import mapPoint from "@/app/assets/mapPoint.png";

export type MapPoint = {
  id: number;
  lat: number;
  lng: number;
  title: string;
  approx?: boolean;
};

type Props = {
  points: MapPoint[];
  label?: string;
  style?: string;
};

function popupContent(point: MapPoint) {
  const link = document.createElement("a");
  link.href = `/drops/${point.id}`;
  const strong = document.createElement("b");
  strong.textContent = point.approx ? `${point.title} (position approximative)` : point.title;
  link.append(strong);
  return link;
}

export default function DropMap({ points, label = "Carte des drops", style }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const pointsKey = JSON.stringify(points);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const list: MapPoint[] = JSON.parse(pointsKey);
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    // Import dynamique : Leaflet a besoin de `window`, il ne doit jamais être chargé côté serveur.
    import("leaflet").then(({ default: L }) => {
      if (cancelled) return;

      const map = L.map(container);

      
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.icon({
        iconUrl: mapPoint.src,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -50],
      });

      for (const point of list) {
        const layer = point.approx
          ? L.circle([point.lat, point.lng], { radius: 300 })
          : L.marker([point.lat, point.lng], { icon });
        layer.bindPopup(popupContent(point)).addTo(map);
      }

      if (list.length === 0) {
        map.setView([46.6, 2.5], 5);
      } else if (list.length === 1) {
        map.setView([list[0].lat, list[0].lng], list[0].approx ? 14 : 16);
      } else {
        map.fitBounds(L.latLngBounds(list.map((p) => [p.lat, p.lng])), { padding: [40, 40] });
      }

      cleanup = () => map.remove();
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pointsKey]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={label}
      className={`isolate ${style} overflow-hidden rounded-lg`}
    />
  );
}
