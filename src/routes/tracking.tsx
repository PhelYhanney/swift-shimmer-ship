import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Package, Truck, MapPin, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: "Track Your Shipment — Transpo" },
      { name: "description", content: "Track parcels and freight in real time with Transpo's global tracking network." },
      { property: "og:title", content: "Track Your Shipment — Transpo" },
    ],
  }),
  component: TrackingPage,
});

const steps = [
  { icon: Package, label: "Picked up", time: "Mon, 09:14 AM", done: true },
  { icon: Truck, label: "In transit", time: "Tue, 03:42 PM", done: true },
  { icon: MapPin, label: "Out for delivery", time: "Wed, 08:20 AM", done: true },
  { icon: CheckCircle2, label: "Delivered", time: "Today, 11:05 AM", done: false },
];

function TrackingPage() {
  const [code, setCode] = useState("TRP-9281-LX");
  return (
    <>
      <PageHero eyebrow="Tracking" title="Where is your shipment, right now?" desc="Enter your tracking number and follow your parcel from pickup to doorstep." />
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-[var(--shadow-brand)] sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-md border border-border px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={code} onChange={(e) => setCode(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" />
            </div>
            <button className="btn-shine rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95">
              Track Shipment
            </button>
          </div>
          <div className="mt-10 rounded-2xl border border-border bg-white p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Tracking #</div>
                <div className="text-2xl font-bold text-navy">{code}</div>
              </div>
              <span className="rounded-full bg-yellow px-3 py-1 text-xs font-bold text-navy">In Transit</span>
            </div>
            <div className="space-y-5">
              {steps.map((s, i) => (
                <div key={s.label} className="flex items-start gap-4 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${s.done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 border-b border-border pb-5">
                    <div className="font-semibold text-navy">{s.label}</div>
                    <div className="text-xs text-muted-foreground">{s.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
