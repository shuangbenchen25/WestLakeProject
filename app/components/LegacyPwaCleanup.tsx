"use client";

import { useEffect } from "react";

const CLEANUP_MARKER = "westlake-legacy-pwa-cleared-v1";

export default function LegacyPwaCleanup() {
  useEffect(() => {
    if (window.sessionStorage.getItem(CLEANUP_MARKER)) return;
    window.sessionStorage.setItem(CLEANUP_MARKER, "true");

    const cleanup = async () => {
      const controlled = Boolean(navigator.serviceWorker?.controller);

      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      }

      if ("caches" in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
      }

      if (controlled) window.location.reload();
    };

    void cleanup();
  }, []);

  return null;
}
