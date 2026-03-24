import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal, type BookableSession } from "@/components/BookingModal";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nContext";
import { MapPin, Clock, Dumbbell, Users, ChevronRight, Quote, ExternalLink } from "lucide-react";

import heroImg640 from "@/assets/hero-training-w640.jpg";
import heroImg1280 from "@/assets/hero-training-w1280.jpg";
import heroImg1920 from "@/assets/hero-training-w1920.jpg";
import coachImg from "@/assets/coach-portrait.jpg";
import studioImg from "@/assets/studio-interior.jpg";
import outdoorImg from "@/assets/outdoor-training.jpg";
import communityOutdoorImg from "@/assets/community-outdoor.jpg";
import communityStudioImg from "@/assets/community-studio.jpg";

const CLASSES = [
  { id: "barbellStrength", focus: "Strength", location: "Studio", day: "Mon", time: "07:00", duration: "60 min", spots: 3 },
  { id: "conditioningCircuit", focus: "Conditioning", location: "Outdoor", day: "Mon", time: "18:00", duration: "45 min", spots: 5 },
  { id: "upperBodyPower", focus: "Strength", location: "Studio", day: "Tue", time: "08:00", duration: "60 min", spots: 2 },
  { id: "beachHiit", focus: "Conditioning", location: "Outdoor", day: "Wed", time: "07:00", duration: "45 min", spots: 6 },
  { id: "fullBodyStrength", focus: "Strength", location: "Studio", day: "Wed", time: "19:00", duration: "60 min", spots: 1 },
  { id: "mobilityRecovery", focus: "Mobility", location: "Studio", day: "Thu", time: "09:00", duration: "50 min", spots: 4 },
  { id: "parkStrength", focus: "Strength", location: "Outdoor", day: "Fri", time: "07:00", duration: "60 min", spots: 4 },
  { id: "saturdayGrind", focus: "Conditioning", location: "Outdoor", day: "Sat", time: "09:00", duration: "60 min", spots: 8 },
  { id: "peakHourStrength", focus: "Strength", location: "Studio", day: "Sat", time: "10:30", duration: "60 min", spots: 0 },
] as const;

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type LocationFilter = "all" | "Studio" | "Outdoor";
type FocusFilter = "all" | "Strength" | "Conditioning" | "Mobility";
type DayFilter = "all" | (typeof DAY_ORDER)[number];

type ScheduleRow = (typeof CLASSES)[number];

/** Approximate pins (replace with your exact studio address when ready). */
const MAP_URLS = {
  studio: {
    google: "https://www.google.com/maps/search/?api=1&query=41.3944,2.1636",
    apple: "https://maps.apple.com/?ll=41.3944,2.1636&q=Eixample%20Barcelona",
  },
  outdoorSample: {
    google: "https://www.google.com/maps/search/?api=1&query=41.3888,2.1869",
    apple: "https://maps.apple.com/?ll=41.3888,2.1869&q=Parc%20de%20la%20Ciutadella",
  },
} as const;

const TESTIMONIAL_IDS = ["laura", "tom", "maria", "james"] as const;
const TESTIMONIAL_PEOPLE: Record<(typeof TESTIMONIAL_IDS)[number], { name: string; age: number }> = {
  laura: { name: "Laura", age: 31 },
  tom: { name: "Tom", age: 38 },
  maria: { name: "María", age: 29 },
  james: { name: "James", age: 42 },
};

const FOCUS_MSG: Record<ScheduleRow["focus"], string> = {
  Strength: "schedule.focusStrength",
  Conditioning: "schedule.focusConditioning",
  Mobility: "schedule.focusMobility",
};

const focusColor = (focus: string) => {
  if (focus === "Strength") return "bg-primary/15 text-primary border-primary/30";
  if (focus === "Conditioning") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  return "bg-violet-500/15 text-violet-400 border-violet-500/30";
};

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary/85 mb-2">{children}</p>
  );
}

export default function Index() {
  const { t, locale, setLocale } = useI18n();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<BookableSession | null>(null);
  const [locationFilter, setLocationFilter] = useState<LocationFilter>("all");
  const [focusFilter, setFocusFilter] = useState<FocusFilter>("all");
  const [dayFilter, setDayFilter] = useState<DayFilter>("all");

  const locLabel = (loc: ScheduleRow["location"]) =>
    loc === "Studio" ? t("schedule.locationStudio") : t("schedule.locationOutdoor");

  const openBooking = (row?: ScheduleRow) => {
    setSelectedSession(
      row
        ? {
            name: t(`classes.${row.id}.name`),
            day: row.day,
            time: row.time,
            location: locLabel(row.location),
            duration: row.duration,
          }
        : null,
    );
    setBookingOpen(true);
  };

  const handleBookingOpenChange = (next: boolean) => {
    setBookingOpen(next);
    if (!next) setSelectedSession(null);
  };

  const filteredClasses = useMemo(() => {
    return CLASSES.filter((c) => {
      if (locationFilter !== "all" && c.location !== locationFilter) return false;
      if (focusFilter !== "all" && c.focus !== focusFilter) return false;
      if (dayFilter !== "all" && c.day !== dayFilter) return false;
      return true;
    });
  }, [locationFilter, focusFilter, dayFilter]);

  const scheduleLiveMessage = useMemo(() => {
    const n = filteredClasses.length;
    if (n === 0) return t("schedule.liveNone");
    if (n === 1) return t("schedule.liveOne");
    return t("schedule.liveCount", { n });
  }, [filteredClasses.length, t]);

  const groupedByDay = useMemo(() => {
    const map = new Map<string, ScheduleRow[]>();
    for (const day of DAY_ORDER) {
      const rows = filteredClasses.filter((c) => c.day === day);
      if (rows.length) map.set(day, rows);
    }
    return map;
  }, [filteredClasses]);

  const heroSrcSet = `${heroImg640} 640w, ${heroImg1280} 1280w, ${heroImg1920} 1920w`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ───── STICKY NAV ───── */}
      <header className="fixed top-0 left-0 right-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="container h-14 flex items-center justify-between gap-2">
          <a href="#top" className="font-display text-sm sm:text-base font-semibold tracking-tight rounded-sm shrink-0">
            Alex Moreno
          </a>
          <nav className="hidden sm:flex items-center gap-5 text-sm" aria-label={t("nav.primary")}>
            <a href="#schedule" className="text-muted-foreground hover:text-foreground transition-colors rounded-sm">
              {t("nav.schedule")}
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors rounded-sm">
              {t("nav.about")}
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors rounded-sm">
              {t("nav.testimonials")}
            </a>
            <a href="#practical-info" className="text-muted-foreground hover:text-foreground transition-colors rounded-sm">
              {t("nav.info")}
            </a>
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className="flex items-center rounded-md border border-border bg-background/80 p-0.5"
              role="group"
              aria-label={t("lang.switch")}
            >
              <Button
                type="button"
                variant={locale === "en" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-2.5 text-xs font-display"
                onClick={() => setLocale("en")}
                aria-pressed={locale === "en"}
              >
                EN
              </Button>
              <Button
                type="button"
                variant={locale === "es" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-2.5 text-xs font-display"
                onClick={() => setLocale("es")}
                aria-pressed={locale === "es"}
              >
                ES
              </Button>
            </div>
            <Button
              size="sm"
              className="h-9 px-3 sm:px-4 font-display bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
              onClick={() => openBooking()}
            >
              {t("nav.book")}
            </Button>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="outline-none">
      {/* ───── HERO ───── */}
      <section id="top" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-muted">
        <img
          src={heroImg640}
          alt=""
          width={640}
          height={360}
          className="absolute inset-0 h-full w-full object-cover object-[center_22%] sm:object-[center_30%] md:object-center blur-2xl scale-110 opacity-60 pointer-events-none select-none motion-reduce:blur-none motion-reduce:opacity-30"
          aria-hidden
        />
        <img
          src={heroImg1920}
          srcSet={heroSrcSet}
          sizes="100vw"
          alt={t("hero.heroImageAlt")}
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-40 object-[center_22%] sm:object-[center_30%] md:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="relative z-10 container max-w-3xl text-center px-6 py-32">
          <SectionEyebrow>{t("hero.eyebrow")}</SectionEyebrow>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            {t("hero.titleLine1")}
            <br />
            <span className="text-primary">{t("hero.titleLine2")}</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto mb-10">{t("hero.intro")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-base px-8 h-12" onClick={() => openBooking()}>
              {t("hero.bookSession")}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
            <div className="flex items-center gap-4">
              <a
                href="#schedule"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm underline underline-offset-4 rounded-sm"
              >
                {t("hero.viewSchedule")}
              </a>
              <a
                href="#about"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm underline underline-offset-4 rounded-sm"
              >
                {t("hero.aboutAlex")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───── SCHEDULE ───── */}
      <section
        id="schedule"
        className="py-20 sm:py-28 scroll-mt-20 sm:scroll-mt-24"
        aria-labelledby="schedule-heading"
        role="region"
        aria-label={t("schedule.ariaRegion")}
      >
        <div className="container rounded-xl border border-border/70 bg-card/25 shadow-sm shadow-black/20 px-4 py-8 sm:px-8 sm:py-10">
          <SectionEyebrow>{t("schedule.eyebrow")}</SectionEyebrow>
          <h2 id="schedule-heading" className="font-display text-3xl sm:text-4xl font-bold mb-2">
            {t("schedule.title")}
          </h2>
          <p className="text-muted-foreground mb-8">{t("schedule.subtitle")}</p>

          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {scheduleLiveMessage}
          </p>

          <div className="space-y-6 mb-8">
            <div>
              <p id="schedule-day-label" className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                {t("schedule.filterDay")}
              </p>
              <div
                className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible"
                role="group"
                aria-labelledby="schedule-day-label"
              >
                {(["all", ...DAY_ORDER] as const).map((d) => (
                  <Button
                    key={d}
                    type="button"
                    size="sm"
                    variant={dayFilter === d ? "default" : "outline"}
                    className={cn(
                      "shrink-0 font-display text-xs h-9",
                      dayFilter === d && "bg-primary text-primary-foreground hover:bg-primary/90",
                    )}
                    onClick={() => setDayFilter(d)}
                  >
                    {d === "all" ? t("schedule.allDays") : t(`days.${d}`)}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p id="schedule-location-label" className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                {t("schedule.filterLocation")}
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-labelledby="schedule-location-label">
                {(["all", "Studio", "Outdoor"] as const).map((loc) => (
                  <Button
                    key={loc}
                    type="button"
                    size="sm"
                    variant={locationFilter === loc ? "default" : "outline"}
                    className={cn(
                      "font-display text-xs h-9",
                      locationFilter === loc && "bg-primary text-primary-foreground hover:bg-primary/90",
                    )}
                    onClick={() => setLocationFilter(loc)}
                  >
                    {loc === "all" ? t("schedule.all") : locLabel(loc)}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p id="schedule-focus-label" className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                {t("schedule.filterFocus")}
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-labelledby="schedule-focus-label">
                {(["all", "Strength", "Conditioning", "Mobility"] as const).map((f) => (
                  <Button
                    key={f}
                    type="button"
                    size="sm"
                    variant={focusFilter === f ? "default" : "outline"}
                    className={cn(
                      "font-display text-xs h-9",
                      focusFilter === f && "bg-primary text-primary-foreground hover:bg-primary/90",
                    )}
                    onClick={() => setFocusFilter(f)}
                  >
                    {f === "all" ? t("schedule.all") : t(FOCUS_MSG[f])}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            {groupedByDay.size === 0 ? (
              <p className="text-sm text-muted-foreground rounded-lg border border-border bg-card/40 px-4 py-6 text-center">
                {t("schedule.noMatch")}
              </p>
            ) : (
              Array.from(groupedByDay.entries()).map(([day, rows]) => (
                <div key={day}>
                  <h3 className="font-display text-lg font-semibold text-foreground/95 mb-3 border-b border-border pb-2">
                    {t(`days.${day}`)}
                  </h3>
                  <div className="grid gap-3 sm:gap-4">
                    {rows.map((c) => {
                      const isFull = c.spots === 0;
                      const lastSpots = !isFull && c.spots <= 2;
                      const classNameTr = t(`classes.${c.id}.name`);
                      const dayTr = t(`days.${c.day}`);
                      return (
                        <article
                          key={`${c.id}-${c.day}-${c.time}`}
                          className={cn(
                            "bg-card border rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 transition-colors",
                            isFull
                              ? "border-border/80 opacity-85"
                              : cn(
                                  "border-border hover:border-primary/40",
                                  "transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/25 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none",
                                ),
                            lastSpots && "border-primary/35 shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]",
                          )}
                          aria-label={t("schedule.sessionArticle", { name: classNameTr, day: dayTr, time: c.time })}
                        >
                          <div className="sm:w-28 shrink-0 flex sm:flex-col gap-2 sm:gap-0 sm:items-start items-center">
                            <span className="font-display font-semibold text-sm text-primary">{dayTr}</span>
                            <span className="text-muted-foreground text-sm tabular-nums">{c.time}</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-display font-semibold text-base" id={`session-title-${c.id}`}>
                              {classNameTr}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={cn(focusColor(c.focus), "text-xs font-medium")}>
                              {t(FOCUS_MSG[c.focus])}
                            </Badge>
                            <Badge variant="outline" className="text-xs font-medium border-border text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" aria-hidden />
                              {locLabel(c.location)}
                            </Badge>
                            <Badge variant="outline" className="text-xs font-medium border-border text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" aria-hidden />
                              {c.duration}
                            </Badge>
                            {lastSpots && (
                              <Badge variant="outline" className="text-xs font-medium border-primary/40 text-primary bg-primary/10">
                                {t("schedule.lastSpots")}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                            <span className="text-xs text-muted-foreground tabular-nums min-w-[6rem] sm:text-right">
                              {isFull ? (
                                <span className="font-medium text-foreground/80">{t("schedule.full")}</span>
                              ) : lastSpots ? (
                                <span className="text-primary font-semibold">
                                  {c.spots === 1 ? t("schedule.spotLeft") : t("schedule.spotsLeft", { n: c.spots })}
                                </span>
                              ) : (
                                <span>{t("schedule.spots", { n: c.spots })}</span>
                              )}
                            </span>
                            <Button
                              size="sm"
                              disabled={isFull}
                              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-xs px-4 disabled:opacity-50"
                              aria-label={
                                isFull
                                  ? t("schedule.ariaFull", { name: classNameTr, day: dayTr, time: c.time })
                                  : t("schedule.ariaBook", { name: classNameTr, day: dayTr, time: c.time })
                              }
                              aria-describedby={`session-title-${c.id}`}
                              onClick={() => openBooking(c)}
                            >
                              {isFull ? t("schedule.full") : t("schedule.book")}
                            </Button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ───── TRUST / COACH ───── */}
      <section id="about" className="py-20 sm:py-28 border-t border-border scroll-mt-20 sm:scroll-mt-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <img src={coachImg} alt={t("coach.imageAlt")} width={800} height={1024} loading="lazy" className="rounded-lg w-full max-w-sm mx-auto md:mx-0 aspect-square object-cover" />
            </div>
            <div>
              <SectionEyebrow>{t("coach.eyebrow")}</SectionEyebrow>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">{t("coach.name")}</h2>
              <div className="mb-8 rounded-lg border border-border/80 bg-muted/20 px-4 py-3 text-sm">
                <p className="font-display font-semibold text-foreground/95 text-xs uppercase tracking-wide text-primary/90 mb-1.5">
                  {t("coach.credTitle")}
                </p>
                <p className="text-muted-foreground leading-relaxed">{t("coach.credBody")}</p>
              </div>
              <p className="text-muted-foreground mb-8 leading-relaxed">{t("coach.bio")}</p>
              <ul className="space-y-4">
                {[
                  { icon: Dumbbell, text: t("coach.bullet1") },
                  { icon: Users, text: t("coach.bullet2") },
                  { icon: Clock, text: t("coach.bullet3") },
                ].map((item) => (
                  <li key={item.text} className="flex gap-3 items-start">
                    <item.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/90 text-sm leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Studio + Outdoor images */}
          <div className="grid sm:grid-cols-2 gap-4 mt-16">
            <img src={studioImg} alt={t("coach.studioAlt")} width={1280} height={854} loading="lazy" className="rounded-lg w-full h-64 sm:h-80 object-cover" />
            <img src={outdoorImg} alt={t("coach.outdoorAlt")} width={1280} height={854} loading="lazy" className="rounded-lg w-full h-64 sm:h-80 object-cover" />
          </div>
        </div>
      </section>

      {/* ───── SOCIAL PROOF ───── */}
      <section id="testimonials" className="py-20 sm:py-28 border-t border-border bg-muted/25 scroll-mt-20 sm:scroll-mt-24">
        <div className="container">
          <SectionEyebrow>{t("testimonials.eyebrow")}</SectionEyebrow>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-10">{t("testimonials.title")}</h2>

          <div className="-mx-4 px-4 flex sm:grid sm:grid-cols-2 gap-4 sm:gap-6 mb-12 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none pb-2 sm:pb-0 scroll-smooth [scrollbar-width:thin]">
            {TESTIMONIAL_IDS.map((tid) => {
              const person = TESTIMONIAL_PEOPLE[tid];
              return (
                <div
                  key={tid}
                  className="bg-card border border-border rounded-lg p-6 relative snap-center shrink-0 w-[min(22rem,calc(100vw-3rem))] sm:w-auto sm:shrink"
                >
                  <Quote className="h-5 w-5 text-primary/40 absolute top-5 right-5" aria-hidden />
                  <p className="text-foreground/90 mb-4 leading-relaxed">{t(`testimonials.${tid}.text`)}</p>
                  <p className="text-sm text-muted-foreground">
                    {person.name}, {person.age} — <span className="text-foreground/70">{t(`testimonials.${tid}.role`)}</span>
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <img src={communityOutdoorImg} alt={t("testimonials.communityOutdoorAlt")} width={1280} height={854} loading="lazy" className="rounded-lg w-full h-56 sm:h-72 object-cover" />
            <img src={communityStudioImg} alt={t("testimonials.communityStudioAlt")} width={1280} height={854} loading="lazy" className="rounded-lg w-full h-56 sm:h-72 object-cover" />
          </div>
        </div>
      </section>

      {/* ───── LOGISTICS ───── */}
      <section id="practical-info" className="py-20 sm:py-28 border-t border-border scroll-mt-20 sm:scroll-mt-24">
        <div className="container max-w-4xl">
          <SectionEyebrow>{t("practical.eyebrow")}</SectionEyebrow>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-10">{t("practical.title")}</h2>

          <div className="rounded-xl border border-border/70 bg-card/30 p-5 sm:p-6 mb-10">
            <h3 className="font-display font-semibold text-sm text-primary mb-3">{t("practical.mapsTitle")}</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-2xl">{t("practical.mapsIntro")}</p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground/90">{t("practical.studioPin")}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <a
                    href={MAP_URLS.studio.google}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/90 underline-offset-4 hover:underline"
                  >
                    {t("practical.googleMaps")} <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
                  </a>
                  <a
                    href={MAP_URLS.studio.apple}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/90 underline-offset-4 hover:underline"
                  >
                    {t("practical.appleMaps")} <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
                  </a>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground/90">{t("practical.outdoorPin")}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <a
                    href={MAP_URLS.outdoorSample.google}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/90 underline-offset-4 hover:underline"
                  >
                    {t("practical.googleMaps")} <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
                  </a>
                  <a
                    href={MAP_URLS.outdoorSample.apple}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/90 underline-offset-4 hover:underline"
                  >
                    {t("practical.appleMaps")} <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-sm text-primary mb-1">{t("practical.baseLocation")}</h3>
                <p className="text-foreground/90 text-sm">{t("practical.baseLocationText")}</p>
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-primary mb-1">{t("practical.outdoorLocations")}</h3>
                <p className="text-foreground/90 text-sm">{t("practical.outdoorLocationsText")}</p>
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-primary mb-1">{t("practical.sessionLength")}</h3>
                <p className="text-foreground/90 text-sm">{t("practical.sessionLengthText")}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-sm text-primary mb-1">{t("practical.whatToBring")}</h3>
                <p className="text-foreground/90 text-sm">{t("practical.whatToBringText")}</p>
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-primary mb-1">{t("practical.forYouIf")}</h3>
                <p className="text-foreground/90 text-sm">{t("practical.forYouIfText")}</p>
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-primary mb-1">{t("practical.notForYouIf")}</h3>
                <p className="text-foreground/90 text-sm">{t("practical.notForYouIfText")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="py-24 sm:py-32 border-t border-border">
        <div className="container text-center">
          <SectionEyebrow>{t("cta.eyebrow")}</SectionEyebrow>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">{t("cta.title")}</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t("cta.body")}</p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-base px-10 h-12" onClick={() => openBooking()}>
            {t("cta.book")}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </section>

      </main>

      {/* ───── FOOTER ───── */}
      <footer id="contact" className="border-t border-border py-10 scroll-mt-20 sm:scroll-mt-24">
        <div className="container flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-xs text-muted-foreground">{t("footer.copyright")}</p>
            <p className="mt-2 text-xs text-muted-foreground max-w-sm">
              <span className="text-foreground/70">{t("footer.availabilityLead")}</span> {t("footer.availabilityRest")}
            </p>
          </div>
          <nav className="flex flex-col items-center sm:items-end gap-3" aria-label={t("footer.linksLabel")}>
            <div className="flex flex-wrap justify-center sm:justify-end gap-x-5 gap-y-2 text-xs">
              <a
                href="mailto:alex@barcelona-sessions.com"
                className="text-muted-foreground hover:text-primary transition-colors rounded-sm"
              >
                alex@barcelona-sessions.com
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors rounded-sm"
              >
                {t("footer.instagram")} <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
              </a>
              <a href="#practical-info" className="text-muted-foreground hover:text-primary transition-colors rounded-sm">
                {t("footer.practicalInfo")}
              </a>
              <a href="#schedule" className="text-muted-foreground hover:text-primary transition-colors rounded-sm">
                {t("footer.schedule")}
              </a>
            </div>
            <p className="text-[11px] text-muted-foreground text-center sm:text-right max-w-xs">{t("footer.privacy")}</p>
          </nav>
        </div>
      </footer>

      {/* ───── MOBILE FLOATING CTA ───── */}
      <div className="sm:hidden fixed bottom-4 left-0 right-0 z-30 px-4">
        <Button
          size="lg"
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-display shadow-lg shadow-black/30"
          onClick={() => openBooking()}
        >
          {t("hero.bookSession")}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <BookingModal open={bookingOpen} onOpenChange={handleBookingOpenChange} selectedSession={selectedSession} />
    </div>
  );
}
