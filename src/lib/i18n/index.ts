import { TR } from "./dictionary";

export type Lang = "en" | "tr";
export const LANG_COOKIE = "foxy_lang";

export function translate(lang: Lang, s: string): string {
  if (lang !== "tr") return s;
  return TR[s] ?? s;
}
