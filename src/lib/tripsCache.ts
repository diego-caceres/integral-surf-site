import type { Trip } from "@/types/trip";

const TRIPS_LS_KEY = "integral_trips_cache";
const DESTINOS_TITLE_LS_KEY = "integral_destinos_title_cache";

// Module-level promise singletons — deduplicate concurrent fetches within a page load
let tripsPromise: Promise<Trip[]> | null = null;
let destinosTitlePromise: Promise<string> | null = null;

function readLS<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

function writeLS<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function getTripsFromCache(): Trip[] | null {
  return readLS<Trip[]>(TRIPS_LS_KEY);
}

export function getDestinosTitleFromCache(): string | null {
  return readLS<string>(DESTINOS_TITLE_LS_KEY);
}

export function fetchTripsOnce(): Promise<Trip[]> {
  if (!tripsPromise) {
    tripsPromise = fetch("/api/trips")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch trips");
        return r.json() as Promise<Trip[]>;
      })
      .then((data) => {
        writeLS(TRIPS_LS_KEY, data);
        return data;
      })
      .catch((err) => {
        tripsPromise = null;
        throw err;
      });
  }
  return tripsPromise;
}

export function fetchDestinosTitleOnce(): Promise<string> {
  if (!destinosTitlePromise) {
    destinosTitlePromise = fetch("/api/config/menu_destinos_title")
      .then((r) => (r.ok ? r.json() : { value: null }))
      .then((data: { value?: string }) => {
        const title = data.value || "DESTINOS 2026";
        writeLS(DESTINOS_TITLE_LS_KEY, title);
        return title;
      })
      .catch(() => {
        destinosTitlePromise = null;
        return "DESTINOS 2026";
      });
  }
  return destinosTitlePromise;
}
