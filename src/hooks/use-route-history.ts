import { useCallback, useRef } from "react"
import { STORAGE_KEYS } from "@/lib/config"

// Persist a Markov-style transition frequency map in sessionStorage so route
// prediction improves throughout the session without surviving page reloads.
const STORAGE_KEY = STORAGE_KEYS.routeHistory

type FrequencyMap = Record<string, Record<string, number>>

// Collapse sub-paths into their top-level section so "/appointments/upcoming"
// and "/appointments/schedule" both count as the same origin/destination.
function normalizeRoute(path: string): string {
  const segment = path.split("/")[1] ?? ""
  return segment ? `/${segment}` : "/"
}

function loadMap(): FrequencyMap {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as FrequencyMap) : {}
  } catch {
    return {}
  }
}

function saveMap(map: FrequencyMap) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // Quota exceeded or storage unavailable — silently skip
  }
}

export function useRouteHistory() {
  const prevNormalizedRef = useRef<string | null>(null)
  const mapRef = useRef<FrequencyMap>(loadMap())

  /** Call this every time activePath changes. */
  const recordVisit = useCallback((path: string) => {
    const to = normalizeRoute(path)
    const from = prevNormalizedRef.current

    if (from && from !== to) {
      const map = mapRef.current
      if (!map[from]) map[from] = {}
      map[from][to] = (map[from][to] ?? 0) + 1
      saveMap(map)
    }

    prevNormalizedRef.current = to
  }, [])

  /**
   * Returns the top-N most likely next routes based on recorded history for
   * `currentPath`. Falls back to an empty array when there is no history yet.
   */
  const getPredictedRoutes = useCallback((currentPath: string, topN = 3): string[] => {
    const from = normalizeRoute(currentPath)
    const transitions = mapRef.current[from]
    if (!transitions) return []

    return Object.entries(transitions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, topN)
      .map(([route]) => route)
  }, [])

  return { recordVisit, getPredictedRoutes }
}
