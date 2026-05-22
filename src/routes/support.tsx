import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — Transpo" },
      { name: "description", content: "Get in touch with the Transpo team. We're here 24/7 to help with quotes, claims and questions." },
      { property: "og:title", content: "Support — Transpo" },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <>
      <PageHero eyebrow="Support" title="We're here when you need us." desc="Reach our support team by phone, email or live chat — 24 hours a day, every day of the year." />
      <section className="bg-background py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {[
              { icon: Phone, title: "Call us", value: "(201) 555-0119", color: "bg-primary text-primary-foreground" },
              { icon: Mail, title: "Email", value: "info@logist.com", color: "bg-yellow text-navy" },
              { icon: MessageCircle, title: "Live chat", value: "Available 24/7", color: "bg-teal text-navy" },
              { icon: MapPin, title: "Headquarters", value: "Liebherrstraße 20, München", color: "bg-navy text-navy-foreground" },
            ].map((c) => (
              <div key={c.title} className={`hover-lift flex items-center gap-4 rounded-xl p-5 ${c.color}`}>
                <c.icon className="h-7 w-7" />
                <div>
                  <div className="text-xs uppercase tracking-widest opacity-80">{c.title}</div>
                  <div className="font-semibold">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
          <form className="rounded-2xl border border-border bg-white p-8 shadow-lg">
            <h2 className="mb-1 text-2xl font-bold text-navy">Send us a message</h2>
            <p className="mb-6 text-sm text-muted-foreground">We respond within 4 business hours.</p>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" />
                <Field label="Last name" />
              </div>
              <Field label="Email" type="email" />
              <Field label="Tracking number (optional)" />
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy">Message</label>
                <textarea rows={5} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <button type="button" className="btn-shine w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-navy">{label}</label>
      <input type={type} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
    </div>
  );
}
