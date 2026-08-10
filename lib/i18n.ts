import { cookies } from "next/headers";
import en from "./dictionaries/en";
import fr from "./dictionaries/fr";

export type Lang = "en" | "fr";
export type Dict = typeof en;

const dictionaries: Record<Lang, Dict> = { en, fr };

export function getLang(): Lang {
  const lang = cookies().get("lang")?.value;
  return lang === "fr" ? "fr" : "en";
}

export function getDict(): Dict {
  return dictionaries[getLang()];
}
