import "server-only";
import { cookies } from "next/headers";
import { translate, LANG_COOKIE, type Lang } from "./index";

export async function getLang(): Promise<Lang> {
  const v = (await cookies()).get(LANG_COOKIE)?.value;
  return v === "tr" ? "tr" : "en";
}

export async function getT() {
  const lang = await getLang();
  return (s: string) => translate(lang, s);
}
