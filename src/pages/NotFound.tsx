import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useI18n();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground outline-none"
    >
      <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary/85 mb-4">404</p>
      <h1 className="font-display mb-3 text-3xl font-bold sm:text-4xl">{t("notFound.title")}</h1>
      <p className="mb-8 max-w-md text-center text-muted-foreground">{t("notFound.body")}</p>
      <Link
        to="/"
        className="font-display rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {t("notFound.home")}
      </Link>
    </main>
  );
};

export default NotFound;
