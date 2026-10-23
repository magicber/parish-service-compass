import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  REQUEST_STATUSES,
  SERVICE_LABELS,
  STATUS_LABELS,
  requestsQueryOptions,
  type RequestStatus,
  type ServiceRequest,
} from "@/lib/requests.functions";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      {
        title: "Parish Office Dashboard — St. Joseph Parish",
        name: "description",
        content:
          "Process and track parish service requests — baptisms, weddings, funerals, blessings and more.",
      },
      { property: "og:title", content: "Parish Office Dashboard — St. Joseph Parish" },
      {
        property: "og:description",
        content: "Process and track parish service requests.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(requestsQueryOptions),
  component: Dashboard,
});

const statusStyles: Record<RequestStatus, string> = {
  pending: "bg-accent/25 text-accent-foreground border-accent/50",
  approved: "bg-primary/10 text-primary border-primary/30",
  completed: "bg-secondary text-secondary-foreground border-border",
  declined: "bg-destructive/10 text-destructive border-destructive/30",
};

function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function StatsCards({ requests }: { requests: ServiceRequest[] }) {
  const counts = {
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    completed: requests.filter((r) => r.status === "completed").length,
    all: requests.length,
  };
  const cards = [
    { label: "Total requests", value: counts.all },
    { label: "Pending", value: counts.pending },
    { label: "Approved", value: counts.approved },
    { label: "Completed", value: counts.completed },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</p>
          <p className="mt-1 font-display text-3xl font-semibold text-primary">{c.value}</p>
        </div>
      ))}
    </div>
  );
}

function RequestRow({
  request,
  onStatusChange,
  busy,
}: {
  request: ServiceRequest;
  onStatusChange: (status: RequestStatus) => void;
  busy: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-semibold">{request.full_name}</h3>
          <StatusBadge status={request.status as RequestStatus} />
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {SERVICE_LABELS[request.service_type] ?? request.service_type}
          {request.preferred_date && (
            <span>
              {" · "}Preferred:{" "}
              {new Date(request.preferred_date + "T00:00:00").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          <span>
            {" · "}Received{" "}
            {new Date(request.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </p>
        <p className="mt-1 text-sm">
          <span className="text-muted-foreground">Contact: </span>
          {request.email}
          {request.phone && <span className="text-muted-foreground"> · {request.phone}</span>}
        </p>
        {request.notes && (
          <p className="mt-2 rounded-md bg-secondary/70 px-3 py-2 text-sm text-secondary-foreground">
            {request.notes}
          </p>
        )}
      </div>
      <div className="shrink-0">
        <label htmlFor={`status-${request.id}`} className="sr-only">
          Update status
        </label>
        <select
          id={`status-${request.id}`}
          value={request.status}
          disabled={busy}
          onChange={(e) => onStatusChange(e.target.value as RequestStatus)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-60"
        >
          {REQUEST_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Dashboard() {
  const queryClient = useQueryClient();
  const { data: requests } = useSuspenseQuery(requestsQueryOptions);
  const [filter, setFilter] = useState<"all" | RequestStatus>("all");

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RequestStatus }) => {
      const { error } = await supabase
        .from("service_requests")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestsQueryOptions.queryKey });
    },
  });

  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const tabs: { key: "all" | RequestStatus; label: string; count: number }[] = [
    { key: "all", label: "All", count: requests.length },
    ...REQUEST_STATUSES.map((s) => ({
      key: s,
      label: STATUS_LABELS[s],
      count: requests.filter((r) => r.status === s).length,
    })),
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Parish Office Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Every service request submitted through the parish website, ready to process.
        </p>
      </div>

      <div className="mt-8">
        <StatsCards requests={requests} />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === t.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            No requests in this view.
          </div>
        ) : (
          filtered.map((r) => (
            <RequestRow
              key={r.id}
              request={r}
              busy={updateStatus.isPending && updateStatus.variables?.id === r.id}
              onStatusChange={(status) =>
                updateStatus.mutate({ id: r.id, status })
              }
            />
          ))
        )}
      </div>

      {updateStatus.isError && (
        <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Failed to update the status. Please try again.
        </p>
      )}
    </div>
  );
}
