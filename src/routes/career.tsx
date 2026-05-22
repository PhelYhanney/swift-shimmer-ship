import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "Careers — Transpo" },
      { name: "description", content: "Join the Transpo team — open roles across logistics, technology, operations and customer success." },
      { property: "og:title", content: "Careers — Transpo" },
    ],
  }),
  component: CareerPage,
});

const jobs = [
  { title: "Senior Logistics Engineer", team: "Operations", location: "München, DE" },
  { title: "Product Designer, Tracking", team: "Product", location: "Remote" },
  { title: "Customs Compliance Analyst", team: "Legal", location: "Singapore" },
  { title: "Warehouse Operations Lead", team: "Operations", location: "Dubai, AE" },
  { title: "Full-Stack Engineer", team: "Engineering", location: "Remote" },
  { title: "Account Executive, SMB", team: "Sales", location: "New York, US" },
];

const values = [
  { title: "Move things forward", desc: "We ship. Every day, in every sense of the word." },
  { title: "Customer obsessed", desc: "Every parcel matters — because every parcel matters to someone." },
  { title: "One global team", desc: "3,500+ agents across 6 continents, one shared mission." },
];

function CareerPage() {
  return (
    <>
      <PageHero eyebrow="Careers" title="Build the future of global logistics." desc="Help us move the world more efficiently — across 80+ countries and counting." />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <div key={v.title} className="hover-lift rounded-2xl bg-secondary p-6" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
                  {i + 1}
                </div>
                <h3 className="mb-1 text-lg font-bold text-navy">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>

          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary">Open Roles</div>
              <h2 className="mt-1 text-3xl font-bold text-navy">{jobs.length} positions worldwide</h2>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-white">
            {jobs.map((j, i) => (
              <a key={j.title} href="#" className="group flex flex-col items-start justify-between gap-3 border-b border-border p-6 transition-colors hover:bg-secondary sm:flex-row sm:items-center" style={{ borderBottom: i === jobs.length - 1 ? "none" : undefined }}>
                <div>
                  <h3 className="text-lg font-bold text-navy transition-colors group-hover:text-primary">{j.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {j.team}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {j.location}</span>
                  </div>
                </div>
                <span className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-navy transition-all group-hover:gap-3 group-hover:bg-primary group-hover:text-primary-foreground">
                  Apply <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
