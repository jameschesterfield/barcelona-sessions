

## Alex Moreno — Personal Trainer Website

### Overview
A single-page, mobile-first personal training website for Alex Moreno, Barcelona-based S&C coach. Dark/neutral aesthetic with orange accents. Every section drives toward booking. A built-in booking modal handles session selection with date/time picking.

---

### Sections

**1. Hero**
- Dark background with a full-width training image (AI-generated)
- Headline: "Stronger. More Consistent. More Efficient."
- Subline: "Structured strength & conditioning — indoor studio or outdoor across Barcelona."
- Orange "Book Your Session" CTA button
- "View Schedule" text link that smooth-scrolls to timetable

**2. Schedule / Timetable**
- Grid/table layout showing weekly classes
- Each card: class name, focus tag (Strength / Conditioning / Mobility), location badge (Studio / Outdoor), duration, spots available
- Orange "Book" button per class → opens booking modal
- 6-8 sample classes across the week
- Feels functional and system-like, not decorative

**3. Trust — Coach Profile**
- Alex's portrait (AI-generated)
- 3 credibility bullets (e.g., "10+ years coaching experience", "Structured programming, not random workouts", "Consistency over intensity")
- Two images: clean studio interior + outdoor Barcelona training scene (AI-generated)

**4. Social Proof**
- 3-4 short testimonials (1-2 lines), each with first name, age, profession
- Community training photos (AI-generated, showing both indoor/outdoor)

**5. Logistics**
- Clean info grid: base location, outdoor locations, session length, what to bring, who it's for / not for
- Minimal, scannable layout

**6. Final CTA**
- Full-width dark section
- "Ready to train?" + orange "Book Your Session" button

**7. Booking Modal (Dialog)**
- Triggered from any "Book" button
- Shows selected class info (or general if from hero/footer CTA)
- Date picker (shadcn Calendar)
- Time slot selection
- Name + phone fields only (no email capture, just enough to confirm)
- "Confirm Booking" button
- Success toast on submission

---

### Design System
- **Base**: Near-black background (#0A0A0A), off-white text
- **Accent**: Orange (#F97316) for CTAs, availability dots, hover states
- **Typography**: Strong hierarchy — large bold headings, clean body text
- **Spacing**: Generous padding, grid-based layout
- **Images**: AI-generated via Nano banana for hero, coach portrait, studio, outdoor, and community shots

