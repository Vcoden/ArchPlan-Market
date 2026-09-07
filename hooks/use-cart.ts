"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "archplan:cart";

function readCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function useCart() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readCart());
    const sync = () => setIds(readCart());
    window.addEventListener("storage", sync);
    window.addEventListener("archplan:cart", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("archplan:cart", sync);
    };
  }, []);

  const persist = (next: string[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setIds(next);
    window.dispatchEvent(new Event("archplan:cart"));
  };

  const add = useCallback((planId: string) => {
    const current = readCart();
    if (!current.includes(planId)) persist([...current, planId]);
  }, []);

  const remove = useCallback((planId: string) => {
    persist(readCart().filter((id) => id !== planId));
  }, []);

  const clear = useCallback(() => persist([]), []);

  return {
    ids,
    count: ids.length,
    has: (planId: string) => ids.includes(planId),
    add,
    remove,
    clear,
  };
}
