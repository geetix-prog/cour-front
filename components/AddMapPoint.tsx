"use client";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import mapPoint from "@/app/assets/mapPoint.png";
import type { Place } from "@/lib/geocode";
import MapSearch from "./MapSearch";

export type LatLng = { lat: number; lng: number };

type Props = {
    value: LatLng | null;
    onChange: (position: LatLng) => void;
};

export default function AddMapPoint({ value, onChange }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<LeafletMap | null>(null);
    const markerRef = useRef<Marker | null>(null);
    const leafletRef = useRef<typeof import("leaflet") | null>(null);
    const iconRef = useRef<Icon | null>(null);
    const onChangeRef = useRef(onChange);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let cancelled = false;

        import("leaflet").then(({ default: L }) => {
        if (cancelled) return;

        const map = L.map(container).setView([46.6, 2.5], 5);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        L.control.scale({ imperial: false }).addTo(map);

        map.on("click", (e) => {
            onChangeRef.current({
            lat: Number(e.latlng.lat.toFixed(6)),
            lng: Number(e.latlng.lng.toFixed(6)),
            });
        });

        leafletRef.current = L;
        iconRef.current = L.icon({
            iconUrl: mapPoint.src,
            iconSize: [50, 50],
            iconAnchor: [25, 50],
        });
        mapRef.current = map;
        setReady(true);
        });

        return () => {
        cancelled = true;
        mapRef.current?.remove();
        mapRef.current = null;
        markerRef.current = null;
        setReady(false);
        };
    }, []);

    useEffect(() => {
        const L = leafletRef.current;
        const map = mapRef.current;
        if (!ready || !L || !map) return;

        if (!value) {
        markerRef.current?.remove();
        markerRef.current = null;
        return;
        }

        if (markerRef.current) {
        markerRef.current.setLatLng(value);
        } else {
        markerRef.current = L.marker(value, { icon: iconRef.current ?? undefined }).addTo(map);
        }
    }, [ready, value]);

    // --- Recherche de lieu ---

    /**
     * Appelée par MapSearch quand on choisit un lieu : la carte s'y déplace.
     * On ne pose PAS le marqueur ici : l'utilisateur clique ensuite à l'endroit exact du drop.
     */
    function goTo(place: Place) {
        const map = mapRef.current;
        if (!map) return;
        // Lieu avec une zone (ville, grand bâtiment) : on cadre toute la zone.
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
        // Conteneur en `relative` : la carte le remplit et la recherche se pose par-dessus.
        // La recherche est en dehors de la div de Leaflet : cliquer dedans ne place pas de marqueur.
        <div className="relative isolate h-72 w-full overflow-hidden rounded-xl border border-border">
            <div
                ref={containerRef}
                role="region"
                aria-label="Carte : clique pour placer le drop"
                className="h-full w-full cursor-crosshair"
            />
            <MapSearch onSelect={goTo} getCenter={getCenter} />
        </div>
    );
}
