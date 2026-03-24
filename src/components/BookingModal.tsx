import { useEffect, useId, useMemo, useState } from "react";
import { addDays, format, isBefore, startOfDay } from "date-fns";
import { enUS, es as esLocale } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const GENERIC_TIME_SLOTS = ["07:00", "08:00", "09:00", "10:00", "17:00", "18:00", "19:00", "20:00"];

export type BookableSession = {
  name: string;
  day: string;
  time: string;
  location: string;
  duration: string;
};

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSession: BookableSession | null;
}

function dayCodeToJsDay(code: string): number {
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[code] ?? 1;
}

function nextDateForWeekday(dayCode: string, from: Date = new Date()): Date {
  const targetDow = dayCodeToJsDay(dayCode);
  const today = startOfDay(from);
  for (let i = 0; i < 7; i++) {
    const candidate = addDays(today, i);
    if (candidate.getDay() === targetDow) return candidate;
  }
  return today;
}

function isValidOptionalEmail(value: string): boolean {
  const t = value.trim();
  if (!t) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

export function BookingModal({ open, onOpenChange, selectedSession }: BookingModalProps) {
  const { locale, t } = useI18n();
  const dfLocale = locale === "es" ? esLocale : enUS;

  const formId = useId();
  const dateTriggerId = `${formId}-date-trigger`;
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const phoneId = `${formId}-phone`;
  const timeLegendId = `${formId}-time-legend`;

  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const timeOptions = useMemo(
    () => (selectedSession ? [selectedSession.time] : GENERIC_TIME_SLOTS),
    [selectedSession],
  );

  /** Clear all fields whenever the dialog closes; initialize session defaults when it opens. */
  useEffect(() => {
    if (!open) {
      setDate(undefined);
      setTime(undefined);
      setName("");
      setPhone("");
      setEmail("");
      return;
    }
    if (selectedSession) {
      setDate(nextDateForWeekday(selectedSession.day));
      setTime(selectedSession.time);
      return;
    }
    setDate(undefined);
    setTime(undefined);
  }, [open, selectedSession]);

  const handleConfirm = () => {
    if (!date || !time || !name.trim() || !phone.trim()) {
      toast({ title: t("booking.required"), variant: "destructive" });
      return;
    }
    if (!isValidOptionalEmail(email)) {
      toast({ title: t("booking.badEmail"), variant: "destructive" });
      return;
    }
    const sessionTitle = selectedSession?.name ?? t("booking.personalTraining");
    const loc = selectedSession?.location;
    const bits = [`${sessionTitle}`, format(date, "PPP", { locale: dfLocale }), time];
    if (loc) bits.push(loc);
    if (email.trim()) bits.push(email.trim());
    toast({ title: t("booking.toastTitle"), description: bits.join(" · ") });
    onOpenChange(false);
  };

  const sessionSummary = selectedSession
    ? `${selectedSession.day} · ${selectedSession.time} · ${selectedSession.location} · ${selectedSession.duration}`
    : null;

  const calendarDisabled = (d: Date) => {
    const dayStart = startOfDay(d);
    if (isBefore(dayStart, startOfDay(new Date()))) return true;
    if (selectedSession) return d.getDay() !== dayCodeToJsDay(selectedSession.day);
    return false;
  };

  const req = t("booking.requiredMark");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl pr-8">
            {selectedSession ? t("booking.titleNamed", { name: selectedSession.name }) : t("booking.titleGeneric")}
          </DialogTitle>
          {selectedSession ? (
            <DialogDescription>
              {t("booking.descSession", {
                summary: sessionSummary ?? "",
                location: selectedSession.location,
              })}
            </DialogDescription>
          ) : (
            <DialogDescription>{t("booking.descGeneric")}</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {sessionSummary && (
            <p className="text-xs rounded-md border border-border bg-muted/30 px-3 py-2 text-muted-foreground" aria-hidden>
              <span className="font-medium text-foreground/80">{t("booking.sessionSummaryLabel")}</span> · {sessionSummary}
            </p>
          )}

          {/* Date */}
          <div>
            <label htmlFor={dateTriggerId} className="text-sm text-muted-foreground mb-1.5 block">
              {t("booking.date")}
              <span className="text-destructive">{req}</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id={dateTriggerId}
                  type="button"
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0" aria-hidden />
                  {date ? format(date, "PPP", { locale: dfLocale }) : t("booking.selectDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={calendarDisabled}
                  initialFocus
                  locale={dfLocale}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time */}
          <div role="group" aria-labelledby={timeLegendId}>
            <p id={timeLegendId} className="text-sm text-muted-foreground mb-1.5">
              {t("booking.time")}
              <span className="text-destructive">{req}</span>
            </p>
            <div className="grid grid-cols-4 gap-2">
              {timeOptions.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  variant={time === slot ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTime(slot)}
                  className={cn("text-xs tabular-nums", time === slot && "bg-primary text-primary-foreground")}
                  aria-pressed={time === slot}
                >
                  {slot}
                </Button>
              ))}
            </div>
            {selectedSession && (
              <p className="text-xs text-muted-foreground mt-2">{t("schedule.fixedTimeHint")}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor={nameId} className="text-sm text-muted-foreground mb-1.5 block">
              {t("booking.name")}
              <span className="text-destructive">{req}</span>
            </label>
            <Input id={nameId} name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("booking.namePh")} autoComplete="name" />
          </div>

          {/* Email */}
          <div>
            <label htmlFor={emailId} className="text-sm text-muted-foreground mb-1.5 block">
              {t("booking.email")}{" "}
              <span className="text-foreground/50 font-normal">{t("booking.emailOptional")}</span>
            </label>
            <Input
              id={emailId}
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("booking.emailPh")}
              type="email"
              inputMode="email"
              autoComplete="email"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor={phoneId} className="text-sm text-muted-foreground mb-1.5 block">
              {t("booking.phone")}
              <span className="text-destructive">{req}</span>
            </label>
            <Input
              id={phoneId}
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("booking.phonePh")}
              type="tel"
              autoComplete="tel"
            />
          </div>

          <Button type="button" onClick={handleConfirm} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display">
            {t("booking.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
