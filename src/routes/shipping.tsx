import { createFileRoute } from "@tanstack/react-router";
import { Plane, Ship, Truck, Package, Globe, Clock } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping Services — Transpo" },
      { name: "description", content: "Air, ocean and land freight services designed for every shipment size and timeline." },
      { property: "og:title", content: "Shipping Services — Transpo" },
    ],
  }),
  component: ShippingPage,
});

const services = [
  { icon: Plane, title: "Air Cargo", desc: "Same-day and next-day worldwide express by air.", color: "bg-primary text-primary-foreground" },
  { icon: Ship, title: "Ocean Freight", desc: "FCL and LCL ocean freight across major sea routes.", color: "bg-yellow text-navy" },
  { icon: Truck, title: "Land Freight", desc: "Reliable trucking, last-mile and cross-border road freight.", color: "bg-teal text-navy" },
  { icon: Package, title: "Express Parcels", desc: "Door-to-door parcel delivery with real-time tracking.", color: "bg-navy text-navy-foreground" },
  { icon: Globe, title: "Cross Border", desc: "Seamless customs clearance and international compliance.", color: "bg-secondary text-navy" },
  { icon: Clock, title: "Time-Critical", desc: "Charter and on-board courier for mission-critical shipments.", color: "bg-secondary text-navy" },
];

function ShippingPage() {
  return (
    <>
      <PageHero eyebrow="Shipping" title="One partner, every mode of transport." desc="From documents to oversized cargo, choose the shipping option that fits your timeline, budget and destination." />
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div key={s.title} className={`hover-lift rounded-2xl p-8 ${s.color}`} style={{ animationDelay: `${i * 60}ms` }}>
              <s.icon className="mb-4 h-10 w-10" />
              <h3 className="mb-2 text-xl font-bold">{s.title}</h3>
              <p className="text-sm opacity-85">{s.desc}</p>
              <button className="btn-shine mt-6 inline-flex items-center rounded-md bg-white/15 px-4 py-2 text-sm font-semibold transition-transform hover:scale-105 active:scale-95">
                Learn more
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
