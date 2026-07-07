import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import ca from "@/lib/i18n/locales/ca.json";
import en from "@/lib/i18n/locales/en.json";
import es from "@/lib/i18n/locales/es.json";

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
    supportedLngs: supportedLanguages,
    detection: {
      // Solo se respeta una preferencia explícita ya guardada; si no existe,
      // se usa siempre el idioma por defecto (es), sin autodetectar el navegador.
      order: ["localStorage"],
      caches: ["localStorage"],
      lookupLocalStorage: "julia-regader-language",
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Mantiene el atributo lang del documento sincronizado con el idioma activo,
// para que los lectores de pantalla usen la pronunciación correcta.
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;
