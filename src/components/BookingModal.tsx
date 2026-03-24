import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const TIME_SLOTS = ["07:00", "08:00", "09:00", "10:00", "17:00", "18:00", "19:00", "20:00"];

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string | null;
}

export function BookingModal({ open, onOpenChange, className: selectedClass }: BookingModalProps) {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleConfirm = () => {
    if (!date || !time || !name || !phone) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    toast({ title: "Session booked", description: `${selectedClass || "Personal Training"} on ${format(date, "PPP")} at ${time}` });
    onOpenChange(false);
    setDate(undefined);
    setTime(undefined);
    setName("");
    setPhone("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {selectedClass ? `Book: ${selectedClass}` : "Book Your Session"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Date */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Time</label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((t) => (
                <Button
                  key={t}
                  variant={time === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTime(t)}
                  className={cn("text-xs", time === t && "bg-primary text-primary-foreground")}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+34 600 000 000" type="tel" />
          </div>

          <Button onClick={handleConfirm} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display">
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
