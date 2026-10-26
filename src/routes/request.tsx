import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SERVICE_LABELS, SERVICE_TYPES } from "@/lib/requests.functions";
import {
  getFieldGuide,
  getPlaceholder,
  getServiceGuide,
  type FieldKey,
} from "@/lib/service-guidance";

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [
      {
        title: "Request a Service — St. Joseph Parish",
        name: "description",
        content:
          "Submit a request for baptism, wedding, funeral, house blessing, first communion, confirmation or mass intention at St. Joseph Parish.",
      },
      { property: "og:title", content: "Request a Service — St. Joseph Parish" },
      {
        property: "og:description",
        content:
          "Submit a request for baptism, wedding, funeral, blessing or other parish services online.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RequestPage,
});

const inputClass =
  "w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring focus:ring-2 focus:ring-ring/30";

function FieldAssistant({
  serviceType,
  field,
}: {
  serviceType: string;
  field: FieldKey | null;
}) {
  const guide = field ? getFieldGuide(serviceType, field) : null;
  const service = getServiceGuide(serviceType);
  const serviceLabel = SERVICE_LABELS[serviceType] ?? serviceType;

  return (
    <aside
      aria-live="polite"
      className="mt-10 rounded-xl border border-border bg-card p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/25 text-sm text-accent-foreground"
          aria-hidden
        >
          ✦
        </span>
        {guide ? (
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Guide · {serviceLabel}
            </p>
            <h2 className="mt-0.5 font-display text-lg font-semibold">{guide.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{guide.hint}</p>
            {guide.example && (
              <p className="mt-2 text-sm text-muted-foreground">
                For example:{" "}
                <span className="font-medium text-foreground">{guide.example}</span>
              </p>
            )}
          </div>
        ) : (
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {serviceLabel}
            </p>
            <p className="mt-1 text-sm">{service.overview}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              {service.tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="text-accent" aria-hidden>
                    •
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}

function RequestPage() {
  const [serviceType, setServiceType] = useState<string>("baptism");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<FieldKey | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const name = fullName.trim();
    const mail = email.trim();
    if (name.length < 2 || name.length > 120) {
      setError("Please enter your full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) || mail.length > 255) {
      setError("Please enter a valid email address.");
      return;
    }
    if (phone.trim().length > 40 || notes.length > 1000) {
      setError("Please shorten your contact number or notes.");
      return;
    }

    setSubmitting(true);
    const { error: dbError } = await supabase.from("service_requests").insert({
      service_type: serviceType,
      full_name: name,
      email: mail,
      phone: phone.trim() || null,
      preferred_date: preferredDate || null,
      notes: notes.trim() || null,
    });
    setSubmitting(false);

    if (dbError) {
      setError("Something went wrong while sending your request. Please try again.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <div className="rounded-xl border border-border bg-card p-10">
          <span className="font-display text-5xl text-accent" aria-hidden>
            ✝
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold">Request received</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Thank you, {fullName.trim().split(" ")[0]}. The parish office will review
            your request and contact you at{" "}
            <span className="font-medium text-foreground">{email.trim()}</span> within
            2–3 working days to confirm the schedule.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFullName("");
              setEmail("");
              setPhone("");
              setPreferredDate("");
              setNotes("");
            }}
            className="mt-8 rounded-md border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Request a Parish Service
        </h1>
        <div className="mx-auto mt-3 h-px w-24 bg-accent" />
        <p className="mt-3 text-sm text-muted-foreground">
          Fill out the form and the parish office will contact you to confirm details
          and requirements.
        </p>
      </div>

      <FieldAssistant serviceType={serviceType} field={focusedField} />

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-5 rounded-xl border border-border bg-card p-6 sm:p-8"
      >
        <div>
          <label htmlFor="serviceType" className="mb-1.5 block text-sm font-medium">
            Service requested
          </label>
          <select
            id="serviceType"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            onFocus={() => setFocusedField("serviceType")}
            className={inputClass}
          >
            {SERVICE_TYPES.map((t) => (
              <option key={t} value={t}>
                {SERVICE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">
            Full name
          </label>
          <input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onFocus={() => setFocusedField("fullName")}
            placeholder={getPlaceholder(serviceType, "fullName") ?? "e.g. Maria Santos"}
            maxLength={120}
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              maxLength={255}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
              Contact number{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+63 917 000 0000"
              maxLength={40}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="preferredDate" className="mb-1.5 block text-sm font-medium">
            Preferred date{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id="preferredDate"
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">
            Notes{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Anything the parish office should know — number of sponsors, location, intentions…"
            className={`${inputClass} resize-y`}
          />
        </div>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send Request"}
        </button>
      </form>
    </div>
  );
}
