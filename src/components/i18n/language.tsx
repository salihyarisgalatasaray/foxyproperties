"use client";
import { createContext, useContext } from "react";
import { translate, LANG_COOKIE, type Lang } from "@/lib/i18n";

const LangCtx = createContext<Lang>("en");

export function LanguageProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangCtx.Provider value={lang}>{children}</LangCtx.Provider>;
}

export function useLang(): Lang {
  return useContext(LangCtx);
}

export function useT() {
  const lang = useContext(LangCtx);
  return (s: string) => translate(lang, s);
}

export function setLang(lang: Lang) {
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
  try {
    localStorage.setItem(LANG_COOKIE, lang);
  } catch {}
  window.location.reload();
}

export function LanguageToggle({ className = "" }: { className?: string }) {
  const lang = useLang();
  const base = "px-1.5 text-[10px] tracking-[.14em] transition-colors";
  return (
    <div data-testid="lang-toggle" className={`flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => lang !== "en" && setLang("en")}
        data-testid="lang-en"
        aria-pressed={lang === "en"}
        className={`${base} ${lang === "en" ? "text-[#D4AF37]" : "text-white/45 hover:text-white"}`}
      >
        EN
      </button>
      <span className="text-white/30">·</span>
      <button
        type="button"
        onClick={() => lang !== "tr" && setLang("tr")}
        data-testid="lang-tr"
        aria-pressed={lang === "tr"}
        className={`${base} ${lang === "tr" ? "text-[#D4AF37]" : "text-white/45 hover:text-white"}`}
      >
        TR
      </button>
    </div>
  );
}
