"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "archplan:favorites";

function readFavorites() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readFavorites());
    const onStorage = () => setIds(readFavorites());
    window.addEventListener("storage", onStorage);
    window.addEventListener("archplan:favorites", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("archplan:favorites", onStorage);
    };
  }, []);

  const persist = (next: string[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setIds(next);
    window.dispatchEvent(new Event("archplan:favorites"));
  };

  const toggle = useCallback((planId: string) => {
    const current = readFavorites();
    persist(current.includes(planId) ? current.filter((id) => id !== planId) : [...current, planId]);
  }, []);

  return {
    ids,
    count: ids.length,
    has: (planId: string) => ids.includes(planId),
    toggle,
  };
}
