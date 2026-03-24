import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SeoSync } from "@/components/SeoSync";
import { I18nProvider, useI18n } from "@/i18n/I18nContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

function SkipToMain() {
  const { t } = useI18n();
  return (
    <a href="#main-content" className="skip-to-main">
      {t("skip")}
    </a>
  );
}

const App = () => (
  <I18nProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SeoSync />
          <SkipToMain />
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  </I18nProvider>
);

export default App;
