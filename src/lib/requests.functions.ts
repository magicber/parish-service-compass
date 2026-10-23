import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type ServiceRequest = Database["public"]["Tables"]["service_requests"]["Row"];
export type RequestStatus = "pending" | "approved" | "completed" | "declined";

export const SERVICE_TYPES = [
  "baptism",
  "wedding",
  "funeral",
  "blessing",
  "first_communion",
  "confirmation",
  "mass_intention",
] as const;

export const SERVICE_LABELS: Record<string, string> = {
  baptism: "Baptism",
  wedding: "Wedding",
  funeral: "Funeral / Requiem",
  blessing: "House Blessing",
  first_communion: "First Communion",
  confirmation: "Confirmation",
  mass_intention: "Mass Intention",
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  completed: "Completed",
  declined: "Declined",
};

export const REQUEST_STATUSES: RequestStatus[] = [
  "pending",
  "approved",
  "completed",
  "declined",
];

// Public read-only fetch for the parish office dashboard. Uses the publishable
// key behind a narrow TO anon SELECT policy — no session, no secrets.
export const listServiceRequests = createServerFn({ method: "GET" }).handler(
  async () => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabasePublic = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false },
      // Opaque sb_ keys aren't JWTs; send only apikey, not the default Authorization bearer.
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { data, error } = await supabasePublic
      .from("service_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Failed to load service requests");
    }
    return data satisfies ServiceRequest[];
  },
);

export const requestsQueryOptions = queryOptions({
  queryKey: ["service-requests"],
  queryFn: listServiceRequests,
});
