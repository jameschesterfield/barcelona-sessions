import { useEffect, useId, useMemo, useState } from "react";
import { addDays, format, isBefore, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    if (!isValidOptionalEmail(email)) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }
    const sessionTitle = selectedSession?.name ?? "Personal Training";
    const loc = selectedSession?.location;
    const bits = [`${sessionTitle}`, format(date, "PPP"), time];
    if (loc) bits.push(loc);
    if (email.trim()) bits.push(email.trim());
    toast({ title: "Session booked", description: bits.join(" · ") });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl pr-8">
            {selectedSession ? `Book: ${selectedSession.name}` : "Book Your Session"}
          </DialogTitle>
          {selectedSession ? (
            <DialogDescription>
              You&apos;re booking this weekly slot: <span className="text-foreground/90">{sessionSummary}</span>. Choose the next date that falls on that day. Location:{" "}
              <span className="text-foreground/90 font-medium">{selectedSession.location}</span>.
            </DialogDescription>
          ) : (
            <DialogDescription>
              Pick a date and time, then leave your details. We&apos;ll confirm by phone or email.
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {sessionSummary && (
            <p className="text-xs rounded-md border border-border bg-muted/30 px-3 py-2 text-muted-foreground" aria-hidden>
              <span className="font-medium text-foreground/80">Session</span> · {sessionSummary}
            </p>
          )}

          {/* Date */}
          <div>
            <label htmlFor={dateTriggerId} className="text-sm text-muted-foreground mb-1.5 block">
              Date<span className="text-destructive">*</span>
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
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={calendarDisabled}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time */}
          <div role="group" aria-labelledby={timeLegendId}>
            <p id={timeLegendId} className="text-sm text-muted-foreground mb-1.5">
              Time<span className="text-destructive">*</span>
            </p>
            <div className="grid grid-cols-4 gap-2">
              {timeOptions.map((t) => (
                <Button
                  key={t}
                  type="button"
                  variant={time === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTime(t)}
                  className={cn("text-xs tabular-nums", time === t && "bg-primary text-primary-foreground")}
                  aria-pressed={time === t}
                >
                  {t}
                </Button>
              ))}
            </div>
            {selectedSession && (
              <p className="text-xs text-muted-foreground mt-2">Time is fixed to this class slot.</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor={nameId} className="text-sm text-muted-foreground mb-1.5 block">
              Name<span className="text-destructive">*</span>
            </label>
            <Input id={nameId} name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
          </div>

          {/* Email */}
          <div>
            <label htmlFor={emailId} className="text-sm text-muted-foreground mb-1.5 block">
              Email <span className="text-foreground/50 font-normal">(optional)</span>
            </label>
            <Input
              id={emailId}
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              inputMode="email"
              autoComplete="email"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor={phoneId} className="text-sm text-muted-foreground mb-1.5 block">
              Phone<span className="text-destructive">*</span>
            </label>
            <Input
              id={phoneId}
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+34 600 000 000"
              type="tel"
              autoComplete="tel"
            />
          </div>

          <Button type="button" onClick={handleConfirm} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display">
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
