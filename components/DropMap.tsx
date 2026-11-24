"use client";
import { useEffect, useRef, useState } from "react";
import type { Icon, LayerGroup, Map as LeafletMap } from "leaflet";
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

export default function DropMap({ points, label = "Carte des drops", style = "h-72 w-full" }: Props) {
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

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={label}
      className={`isolate overflow-hidden rounded-xl border border-border ${style}`}
    />
  );
}
