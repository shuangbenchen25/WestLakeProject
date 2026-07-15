"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Locale = "zh" | "en";

const STORAGE_KEY = "westlake-guide-locale";
const I18nContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
}>({ locale: "zh", setLocale: () => undefined });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved !== "en") return;
    const timer = window.setTimeout(() => setLocaleState("en"), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return <I18nContext.Provider value={{ locale, setLocale }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export function T({ zh, en }: { zh: string; en: string }) {
  const { locale } = useI18n();
  return <>{locale === "zh" ? zh : en}</>;
}
