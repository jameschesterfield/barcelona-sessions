import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/BookingModal";
import { MapPin, Clock, Dumbbell, Users, ChevronRight, Quote } from "lucide-react";

import heroImg from "@/assets/hero-training.jpg";
import coachImg from "@/assets/coach-portrait.jpg";
import studioImg from "@/assets/studio-interior.jpg";
import outdoorImg from "@/assets/outdoor-training.jpg";
import communityOutdoorImg from "@/assets/community-outdoor.jpg";
import communityStudioImg from "@/assets/community-studio.jpg";

const CLASSES = [
  { name: "Barbell Strength", focus: "Strength", location: "Studio", day: "Mon", time: "07:00", duration: "60 min", spots: 3 },
  { name: "Conditioning Circuit", focus: "Conditioning", location: "Outdoor", day: "Mon", time: "18:00", duration: "45 min", spots: 5 },
  { name: "Upper Body Power", focus: "Strength", location: "Studio", day: "Tue", time: "08:00", duration: "60 min", spots: 2 },
  { name: "Beach HIIT", focus: "Conditioning", location: "Outdoor", day: "Wed", time: "07:00", duration: "45 min", spots: 6 },
  { name: "Full Body Strength", focus: "Strength", location: "Studio", day: "Wed", time: "19:00", duration: "60 min", spots: 1 },
  { name: "Mobility & Recovery", focus: "Mobility", location: "Studio", day: "Thu", time: "09:00", duration: "50 min", spots: 4 },
  { name: "Park Strength", focus: "Strength", location: "Outdoor", day: "Fri", time: "07:00", duration: "60 min", spots: 4 },
  { name: "Saturday Grind", focus: "Conditioning", location: "Outdoor", day: "Sat", time: "09:00", duration: "60 min", spots: 8 },
];

const TESTIMONIALS = [
  { text: "Structured, efficient, no wasted time. Exactly what I needed.", name: "Laura", age: 31, role: "Product Manager" },
  { text: "I've trained with coaches before. Alex is the first one I've stuck with.", name: "Tom", age: 38, role: "Software Engineer" },
  { text: "The outdoor sessions changed how I think about training entirely.", name: "María", age: 29, role: "Architect" },
  { text: "Three months in and I'm stronger than I've been in years.", name: "James", age: 42, role: "Finance Director" },
];

const focusColor = (focus: string) => {
  if (focus === "Strength") return "bg-primary/15 text-primary border-primary/30";
  if (focus === "Conditioning") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  return "bg-violet-500/15 text-violet-400 border-violet-500/30";
};

export default function Index() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const openBooking = (className?: string) => {
    setSelectedClass(className || null);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ───── HERO ───── */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Strength training session" width={1920} height={1080} className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="relative z-10 container max-w-3xl text-center px-6 py-32">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Stronger. More Consistent.<br />
            <span className="text-primary">More Efficient.</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto mb-10">
            Structured strength &amp; conditioning — indoor studio or outdoor across Barcelona.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-base px-8 h-12" onClick={() => openBooking()}>
              Book Your Session
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
            <a href="#schedule" className="text-muted-foreground hover:text-foreground transition-colors text-sm underline underline-offset-4">
              View Schedule
            </a>
          </div>
        </div>
      </section>

      {/* ───── SCHEDULE ───── */}
      <section id="schedule" className="py-20 sm:py-28">
        <div className="container">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">Weekly Schedule</h2>
          <p className="text-muted-foreground mb-10">Select a session and book your spot.</p>

          <div className="grid gap-3 sm:gap-4">
            {CLASSES.map((c) => (
              <div key={c.name + c.day} className="bg-card border border-border rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 hover:border-primary/40 transition-colors">
                {/* Day + Time */}
                <div className="sm:w-24 shrink-0">
                  <span className="font-display font-semibold text-sm text-primary">{c.day}</span>
                  <span className="text-muted-foreground text-sm ml-2">{c.time}</span>
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-base">{c.name}</h3>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={cn(focusColor(c.focus), "text-xs font-medium")}>{c.focus}</Badge>
                  <Badge variant="outline" className="text-xs font-medium border-border text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />{c.location}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-medium border-border text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />{c.duration}
                  </Badge>
                </div>

                {/* Spots + Book */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    <span className={c.spots <= 2 ? "text-primary font-semibold" : ""}>{c.spots} spots</span>
                  </span>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-xs px-4" onClick={() => openBooking(c.name)}>
                    Book
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TRUST / COACH ───── */}
      <section className="py-20 sm:py-28 border-t border-border">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <img src={coachImg} alt="Coach Alex Moreno" width={800} height={1024} loading="lazy" className="rounded-lg w-full max-w-sm mx-auto md:mx-0 aspect-square object-cover" />
            </div>
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">Alex Moreno</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Strength &amp; Conditioning Coach based in Barcelona. Training professionals and expats who want structured, efficient sessions — not random workouts.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: Dumbbell, text: "10+ years coaching experience across elite and recreational athletes" },
                  { icon: Users, text: "Structured programming tailored to your capacity and schedule" },
                  { icon: Clock, text: "Consistency over intensity — sustainable progress, every week" },
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
            <img src={studioImg} alt="Training studio interior" width={1280} height={854} loading="lazy" className="rounded-lg w-full h-64 sm:h-80 object-cover" />
            <img src={outdoorImg} alt="Outdoor training in Barcelona" width={1280} height={854} loading="lazy" className="rounded-lg w-full h-64 sm:h-80 object-cover" />
          </div>
        </div>
      </section>

      {/* ───── SOCIAL PROOF ───── */}
      <section className="py-20 sm:py-28 border-t border-border">
        <div className="container">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-10">What Clients Say</h2>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-12">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-card border border-border rounded-lg p-6 relative">
                <Quote className="h-5 w-5 text-primary/40 absolute top-5 right-5" />
                <p className="text-foreground/90 mb-4 leading-relaxed">{t.text}</p>
                <p className="text-sm text-muted-foreground">
                  {t.name}, {t.age} — <span className="text-foreground/70">{t.role}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <img src={communityOutdoorImg} alt="Community outdoor training" width={1280} height={854} loading="lazy" className="rounded-lg w-full h-56 sm:h-72 object-cover" />
            <img src={communityStudioImg} alt="Community studio training" width={1280} height={854} loading="lazy" className="rounded-lg w-full h-56 sm:h-72 object-cover" />
          </div>
        </div>
      </section>

      {/* ───── LOGISTICS ───── */}
      <section className="py-20 sm:py-28 border-t border-border">
        <div className="container max-w-4xl">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-10">Practical Info</h2>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-sm text-primary mb-1">Base Location</h3>
                <p className="text-foreground/90 text-sm">Private studio — Eixample, Barcelona</p>
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-primary mb-1">Outdoor Locations</h3>
                <p className="text-foreground/90 text-sm">Parc de la Ciutadella, Barceloneta Beach, Montjuïc</p>
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-primary mb-1">Session Length</h3>
                <p className="text-foreground/90 text-sm">45–60 minutes, warm-up included</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-sm text-primary mb-1">What to Bring</h3>
                <p className="text-foreground/90 text-sm">Training shoes, water, towel. All equipment provided.</p>
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-primary mb-1">For You If</h3>
                <p className="text-foreground/90 text-sm">You want structured, progressive training and you're ready to commit to a schedule.</p>
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-primary mb-1">Not For You If</h3>
                <p className="text-foreground/90 text-sm">You're looking for casual drop-ins or entertainment-style fitness.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="py-24 sm:py-32 border-t border-border">
        <div className="container text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Ready to train?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Pick a session, choose your time, show up. That's it.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-base px-10 h-12" onClick={() => openBooking()}>
            Book Your Session
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-border py-8">
        <div className="container text-center">
          <p className="text-xs text-muted-foreground">© 2026 Alex Moreno — Strength &amp; Conditioning, Barcelona</p>
        </div>
      </footer>

      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} className={selectedClass} />
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
