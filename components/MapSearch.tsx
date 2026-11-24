"use client";
import { useEffect, useId, useRef, useState } from "react";
import { searchPlaces, type Place } from "@/lib/geocode";

type Props = {
  /** Appelée quand l'utilisateur choisit un lieu dans la liste. */
  onSelect: (place: Place) => void;
  /** Renvoie le centre actuel de la carte, pour favoriser les résultats proches. */
  getCenter?: () => { lat: number; lng: number } | undefined;
};

export default function MapSearch({ onSelect, getCenter }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  /** La liste des suggestions est-elle ouverte ? */
  const [open, setOpen] = useState(false);
  /** Suggestion surlignée au clavier (↑ ↓) ou à la souris ; -1 = aucune. */
  const [active, setActive] = useState(-1);
  /** Identifiant unique pour relier le champ à sa liste (accessibilité). */
  const listId = useId();

  // On garde la dernière version de `getCenter` dans une ref : ainsi l'effet de recherche
  const getCenterRef = useRef(getCenter);
  useEffect(() => {
    getCenterRef.current = getCenter;
  }, [getCenter]);

  // Lance la recherche quand le texte change.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) return;

    // Permet d'annuler la requête si le texte change avant qu'elle ne réponde
    const controller = new AbortController();

    // « Debounce » : on attend 300 ms sans nouvelle frappe avant de chercher
    const timer = setTimeout(async () => {
      setStatus("loading");
      try {
        const places = await searchPlaces(q, getCenterRef.current?.(), controller.signal);
        setResults(places);
        setActive(-1);
        setStatus("idle");
        setOpen(true);
      } catch (error) {
        // Une annulation volontaire n'est pas une vraie erreur : on l'ignore.
        if (!controller.signal.aborted) {
          console.error(error);
          setStatus("error");
          setOpen(true);
        }
      }
    }, 300);

    // Nettoyage : appelé quand le texte change à nouveau (ou quand le composant disparaît)
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function handleChange(value: string) {
    setQuery(value);
    if (value.trim().length < 3) {
      setResults([]);
      setOpen(false);
      setStatus("idle");
    }
  }

  /** Un lieu a été choisi : on prévient la carte et on ferme la liste. */
  function choose(place: Place) {
    onSelect(place);
    setQuery(place.name);
    setOpen(false);
  }

  /** Navigation au clavier dans les suggestions. */
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const place = results[active] ?? results[0];
      if (place) choose(place);
    } else if (e.key === "ArrowDown" && results.length > 0) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length > 0) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showList = open && query.trim().length >= 3;

  return (
    <div className="absolute top-3 right-3 left-14 z-1000 sm:left-auto sm:w-80">
      <input
        type="search"
        role="combobox"
        aria-label="Rechercher un lieu"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setOpen(false)}
        placeholder="Rechercher un lieu..."
        className="h-10 w-full rounded-lg border border-input bg-background/95 px-3 text-sm text-foreground shadow-lg outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
      />

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="mt-1 max-h-72 overflow-y-auto rounded-lg border border-border bg-popover text-sm text-popover-foreground shadow-lg"
        >
          {status === "loading" && <li className="px-3 py-2 text-muted-foreground">Recherche...</li>}
          {status === "error" && <li className="px-3 py-2 text-destructive">La recherche est indisponible pour le moment.</li>}
          {status === "idle" && results.length === 0 && <li className="px-3 py-2 text-muted-foreground">Aucun lieu trouvé.</li>}
          {status === "idle" &&
            results.map((place, index) => (
              <li
                key={place.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === active}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(place);
                }}
                onMouseEnter={() => setActive(index)}
                className={`cursor-pointer px-3 py-2 ${index === active ? "bg-primary/15" : ""}`}
              >
                <span className="block font-semibold text-primary">{place.name}</span>
                {place.context && <span className="block text-xs text-muted-foreground">{place.context}</span>}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
