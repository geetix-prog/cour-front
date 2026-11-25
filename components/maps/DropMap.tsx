"use client";
import { useEffect, useRef, useState } from "react";
import type { Icon, LayerGroup, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import mapPoint from "@/app/assets/mapPoint.png";
import type { Place } from "@/lib/geocode";
import MapSearch from "./MapSearch";

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
  searchable?: boolean;
};

function popupContent(point: MapPoint) {
  const link = document.createElement("a");
  link.href = `/drops/${point.id}`;
  const strong = document.createElement("b");
  strong.textContent = point.approx ? `${point.title} (position approximative)` : point.title;
  link.append(strong);
  return link;
}

export default function DropMap({ points, label = "Carte des drops", style = "h-72 w-full", searchable = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const iconRef = useRef<Icon | null>(null);
  const framedRef = useRef(false);
  const [ready, setReady] = useState(false);

  const pointsKey = JSON.stringify(points);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    import("leaflet").then(({ default: L }) => {
      if (cancelled) return;

      const map = L.map(container);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      leafletRef.current = L;
      iconRef.current = L.icon({
        iconUrl: mapPoint.src,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -50],
      });
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setReady(true);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
      framedRef.current = false;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!ready || !L || !map || !layer) return;

    const list: MapPoint[] = JSON.parse(pointsKey);

    layer.clearLayers();
    for (const point of list) {
      const marker = point.approx
        ? L.circle([point.lat, point.lng], { radius: 300 })
        : L.marker([point.lat, point.lng], { icon: iconRef.current ?? undefined });
      marker.bindPopup(popupContent(point)).addTo(layer);
    }

    if (framedRef.current) return;
    framedRef.current = true;

    if (list.length === 0) {
      map.setView([46.6, 2.5], 5);
    } else if (list.length === 1) {
      map.setView([list[0].lat, list[0].lng], list[0].approx ? 14 : 16);
    } else {
      map.fitBounds(L.latLngBounds(list.map((p) => [p.lat, p.lng])), { padding: [40, 40] });
    }
  }, [ready, pointsKey]);

  // --- Recherche de lieu (affichée seulement si `searchable`) ---

  /** Appelée par MapSearch quand on choisit un lieu : la carte s'y déplace avec une animation. */
  function goTo(place: Place) {
    const map = mapRef.current;
    if (!map) return;
    // Lieu avec une zone (ville, grand bâtiment) : on cadre toute la zone, sans zoomer à l'excès.
    if (place.bounds) map.flyToBounds(place.bounds, { maxZoom: 17 });
    // Simple point (une adresse) : on centre dessus avec un zoom de niveau « rue ».
    else map.flyTo([place.lat, place.lng], 16);
  }

  /** Donne à MapSearch le centre actuel de la carte, pour favoriser les résultats proches. */
  function getCenter() {
    const center = mapRef.current?.getCenter();
    return center ? { lat: center.lat, lng: center.lng } : undefined;
  }

  return (
    // Conteneur en `relative` : la carte le remplit, et la recherche (en `absolute`) se pose
    // par-dessus. La recherche n'est pas DANS la div de Leaflet, donc taper ou scroller
    // dans la liste ne fait pas bouger la carte.
    <div className={`relative isolate overflow-hidden rounded-xl border border-border ${style}`}>
      <div ref={containerRef} role="region" aria-label={label} className="h-full w-full" />
      {searchable && <MapSearch onSelect={goTo} getCenter={getCenter} />}
    </div>
  );
}
