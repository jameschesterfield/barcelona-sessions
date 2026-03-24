import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import { getSiteUrl } from "@/lib/site";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el =
    attr === "name"
      ? document.querySelector(`meta[name="${key}"]`)
      : document.querySelector(`meta[property="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLinkCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Updates document title, description, canonical, and Open Graph / Twitter tags when route or locale changes. */
export function SeoSync() {
  const { locale, t } = useI18n();
  const { pathname } = useLocation();

  useEffect(() => {
    const isHome = pathname === "/";
    document.title = isHome ? t("seo.title") : `${t("notFound.title")} · ${t("seo.title")}`;

    const desc = isHome ? t("seo.description") : t("notFound.body");
    const ogTitle = isHome ? t("seo.ogTitle") : `${t("notFound.title")} · ${t("seo.ogTitle")}`;
    const ogDesc = isHome ? t("seo.ogDescription") : t("notFound.body");

    setMeta("name", "description", desc);
    setMeta("property", "og:title", ogTitle);
    setMeta("property", "og:description", ogDesc);
    setMeta("property", "og:type", "website");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", ogTitle);
    setMeta("name", "twitter:description", ogDesc);

    const site = getSiteUrl();
    if (site) {
      const path = pathname === "/" ? "" : pathname;
      const url = `${site}${path}`;
      setMeta("property", "og:url", url);
      setLinkCanonical(url);
      setMeta("property", "og:image", `${site}/og.jpg`);
      setMeta("name", "twitter:image", `${site}/og.jpg`);
    }
  }, [locale, pathname, t]);

  return null;
}
