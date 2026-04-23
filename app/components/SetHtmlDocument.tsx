"use client";

import { useLayoutEffect } from "react";

/**
 * Keeps `document.documentElement` in sync with the active route when we use a
 * single root `<html>` in `app/layout.tsx`. Without this, client navigations
 * would leave the previous page's `lang` / `dir` / `class` on `<html>`.
 */
export function SetHtmlDocument({
  lang,
  dir,
  className = "",
}: {
  lang: string;
  dir: "ltr" | "rtl";
  className?: string;
}) {
  useLayoutEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = dir;
    el.setAttribute("class", className);
  }, [lang, dir, className]);
  return null;
}
