import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-church.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "St. Joseph Parish — Mass Schedule & Parish Services",
        name: "description",
        content:
          "Mass and confession schedules, sacramental services (baptism, wedding, funeral, blessing), and requests to the parish office of St. Joseph Parish.",
      },
      { property: "og:title", content: "St. Joseph Parish — Mass Schedule & Parish Services" },
      {
        property: "og:description",
        content:
          "Mass and confession schedules and requests for baptism, wedding, funeral and blessings at St. Joseph Parish.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const MASSES = [
  { day: "Sunday", times: "6:00 AM · 8:00 AM · 10:00 AM · 6:00 PM" },
  { day: "Monday – Friday", times: "6:00 AM · 6:00 PM" },
  { day: "Saturday", times: "6:00 AM · 6:00 PM (Anticipated)" },
  { day: "First Friday", times: "Whole-day Adoration, 8:00 AM – 5:00 PM" },
];

const SERVICES = [
  {
    name: "Baptism",
    description: "Sundays after the 10:00 AM Mass. Seminar required for parents and godparents.",
    icon: "💧",
  },
  {
    name: "Wedding",
    description: "By appointment at least three months in advance. Pre-Cana seminar required.",
    icon: "💍",
  },
  {
    name: "Funeral",
    description: "Coordination with the parish office for vigil, requiem Mass, and interment.",
    icon: "🕯️",
  },
  {
    name: "House Blessing",
    description: "Scheduled on weekdays. A priest visits your home for the blessing rite.",
    icon: "🏠",
  },
  {
    name: "First Communion",
    description: "For children enrolled in the parish catechism program.",
    icon: "🍞",
  },
  {
    name: "Confirmation",
    description: "Annual schedule with confirmation classes for youth and adults.",
    icon: "🕊️",
  },
];

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="Interior of St. Joseph Parish church with morning light through stained glass"
          width={1600}
          height={912}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/75" />
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center text-primary-foreground sm:px-6 sm:py-32">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            Est. 1898 · San Roque
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-6xl">
            A house of prayer at the heart of the community
          </h1>
          <p className="mt-4 max-w-xl text-sm text-primary-foreground/85 sm:text-base">
            All are welcome. Join us for the Holy Mass, receive the sacraments,
            and let the parish walk with you through life's milestones.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/request"
              className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Request a Service
            </Link>
            <a
              href="#mass-times"
              className="rounded-md border border-primary-foreground/40 px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              View Mass Times
            </a>
          </div>
        </div>
      </section>

      {/* Mass times */}
      <section id="mass-times" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Mass Schedule</h2>
          <div className="mx-auto mt-3 h-px w-24 bg-accent" />
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
          {MASSES.map((m) => (
            <div
              key={m.day}
              className="flex items-baseline justify-between gap-4 rounded-lg border border-border bg-card px-5 py-4"
            >
              <span className="font-display text-lg font-medium">{m.day}</span>
              <span className="text-right text-sm text-muted-foreground">{m.times}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Confessions: Saturdays 4:30 – 5:30 PM, or by appointment at the parish office.
        </p>
      </section>

      {/* Services */}
      <section className="bg-secondary/50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Parish Services</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              Request any of the following through the parish office. Submit online
              and our staff will confirm the schedule with you.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <Link
                key={s.name}
                to="/request"
                className="group rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <span className="text-2xl" aria-hidden>
                  {s.icon}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold group-hover:text-primary">
                  {s.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/request"
              className="inline-flex rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Submit a Service Request
            </Link>
          </div>
        </div>
      </section>

      {/* Office CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="rounded-xl border border-border bg-card p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Visiting the parish office?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Our staff process every request — track appointments, documents, and
            pending services in the parish office dashboard.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex rounded-md border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Open the Parish Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
