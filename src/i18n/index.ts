import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import ca from "./locales/ca.json";
import en from "./locales/en.json";
import es from "./locales/es.json";

export const supportedLanguages = ["es", "ca", "en"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      ca: { translation: ca },
      en: { translation: en },
    },
    fallbackLng: "es",
    supportedLngs: supportedLanguages as unknown as string[],
    interpolation: {
      escapeValue: false,
    },
    lng: (typeof window !== "undefined" && window.localStorage.getItem("i18nextLng")) || "es",
    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
    },
  });

export default i18n;
