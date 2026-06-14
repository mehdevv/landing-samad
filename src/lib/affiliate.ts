import { useEffect, useState } from "react";

export const AFFILIATES = ["samad", "mehdi"] as const;
export type AffiliateRef = (typeof AFFILIATES)[number];

const STORAGE_KEY = "affiliate_ref";

export function isAffiliateRef(value: string | null | undefined): value is AffiliateRef {
  return value === "samad" || value === "mehdi";
}

function persistRef(ref: AffiliateRef) {
  sessionStorage.setItem(STORAGE_KEY, ref);
}

export function getStoredAffiliateRef(): AffiliateRef | undefined {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  return isAffiliateRef(stored) ? stored : undefined;
}

function resolveAffiliateRef(routeRef?: AffiliateRef): AffiliateRef | undefined {
  if (routeRef) {
    persistRef(routeRef);
    return routeRef;
  }

  const fromQuery = new URLSearchParams(window.location.search).get("ref");
  if (isAffiliateRef(fromQuery)) {
    persistRef(fromQuery);
    return fromQuery;
  }

  return getStoredAffiliateRef();
}

export function useAffiliateRef(routeRef?: AffiliateRef): AffiliateRef | undefined {
  const [ref, setRef] = useState<AffiliateRef | undefined>(() => resolveAffiliateRef(routeRef));

  useEffect(() => {
    setRef(resolveAffiliateRef(routeRef));
  }, [routeRef]);

  return ref;
}
