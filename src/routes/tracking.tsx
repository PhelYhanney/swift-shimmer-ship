import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, MapPin, Loader2, PackageX } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: "Track Your Shipment — Transpo" },
      { name: "description", content: "Track parcels and freight in real time with Transpo's global tracking network." },
      { property: "og:title", content: "Track Your Shipment — Transpo" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    code: (search.code as string) || "",
  }),
  component: TrackingPage,
});

const statusLabels: Record<string, string> = {
  pending: "Pending",
  picked_up: "Picked up",
  in_transit: "In transit",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  exception: "Exception",
  cancelled: "Cancelled",
};

type TrackEvent = {
  status: string;
  location: string | null;
  notes: string | null;
  occurred_at: string;
};

type TrackResult = {
  tracking_number: string;
  status: string;
  service: string;
  origin: string;
  destination: string;
  current_location: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  created_at: string;
  events: TrackEvent[];
};

function TrackingPage() {
  const { code: initialCode } = Route.useSearch();
  const [code, setCode] = useState(initialCode || "");
  const [loading, setLoading] = useState(!!initialCode);
  const [searched, setSearched] = useState(!!initialCode);
  const [result, setResult] = useState<TrackResult | null>(null);

  useEffect(() => {
    if (initialCode && !result) {
      track(initialCode);
    }
  }, [initialCode, result]);

  const track = async (trackingCode?: string) => {
    const trimmed = (trackingCode || code).trim();
    if (!trimmed) return;
    setLoading(true);
    setSearched(true);

    const { data } = await supabase.rpc("get_shipment_tracking", {
      _tracking_number: trimmed,
    });
    const shipment = (data?.[0] as TrackResult | undefined) ?? null;
    setResult(shipment);

    // Log the lookup (anon-allowed insert)
    await supabase.from("tracking_requests").insert({
      tracking_number: trimmed,
      shipment_id: null,
      found: !!shipment,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });

    setLoading(false);
  };

  return (
    <>
      <PageHero eyebrow="Tracking" title="Where is your shipment, right now?" desc="Enter your tracking number and follow your parcel from pickup to doorstep." />
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-[var(--shadow-brand)] sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-md border border-border px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && track()}
                placeholder="e.g. TRP-9281-LX"
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </div>
            <button
              onClick={() => track()}
              disabled={loading || !code.trim()}
              className="btn-shine flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Track Shipment
            </button>
          </div>
          {searched && !loading && !result && (
            <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-10 text-center">
              <PackageX className="h-10 w-10 text-muted-foreground" />
              <div className="font-semibold text-navy">No shipment found</div>
              <p className="text-sm text-muted-foreground">
                We couldn't find a shipment with that tracking number. Double-check and try again.
              </p>
            </div>
          )}
          {result && !loading && (
            <div className="mt-10 rounded-2xl border border-border bg-white p-8 animate-fade-up">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Tracking #</div>
                  <div className="text-2xl font-bold text-navy">{result.tracking_number}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {result.origin} → {result.destination}
                  </div>
                </div>
                <span className="rounded-full bg-yellow px-3 py-1 text-xs font-bold text-navy">
                  {statusLabels[result.status] ?? result.status}
                </span>
              </div>
              {result.estimated_delivery && (
                <div className="mb-6 text-sm text-navy">
                  <span className="text-muted-foreground">Estimated delivery: </span>
                  {new Date(result.estimated_delivery).toLocaleDateString()}
                </div>
              )}
              <div className="space-y-5">
                {result.events.length === 0 && (
                  <p className="text-sm text-muted-foreground">No tracking events yet.</p>
                )}
                {result.events.map((ev, i) => (
                  <div key={i} className="flex items-start gap-4 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1 border-b border-border pb-5">
                      <div className="font-semibold text-navy">{statusLabels[ev.status] ?? ev.status}</div>
                      {ev.location && <div className="text-sm text-navy/70">{ev.location}</div>}
                      {ev.notes && <div className="text-xs text-muted-foreground">{ev.notes}</div>}
                      <div className="text-xs text-muted-foreground">{new Date(ev.occurred_at).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
