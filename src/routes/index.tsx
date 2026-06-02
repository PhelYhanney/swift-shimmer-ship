import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Package, Monitor, MapPin, Truck, DollarSign, ThumbsUp, Shield, ShieldCheck,
  ChevronDown, ChevronLeft, ChevronRight, ArrowRight, Quote,
} from "lucide-react";
import heroTruck from "@/assets/hero-truck.jpg";
import airCargo from "@/assets/air-cargo.jpg";
import oceanFreight from "@/assets/ocean-freight.jpg";
import landFreight from "@/assets/land-freight.jpg";
import articlePort from "@/assets/article-port.jpg";
import articleEcom from "@/assets/article-ecommerce.jpg";
import articleWarehouse from "@/assets/article-warehouse.jpg";
import warehouseWorker from "@/assets/warehouse-worker.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Transpo — Digital Innovation For Hassle-Free Logistics" },
      { name: "description", content: "Worldwide shipping, real-time tracking, and competitive rates for businesses and individuals." },
      { property: "og:title", content: "Transpo — Hassle-Free Logistics" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <ServiceCards />
      <StatsAndWhy />
      <ServiceOfferings />
      <Testimonials />
      <FAQ />
      <Articles />
    </>
  );
}

/* ---------- TYPEWRITER ---------- */
function TypewriterText() {
  const lines = [
    { text: "Digital Innovation", glow: false },
    { text: "For Hassle-Free", glow: false },
    { text: "Logistics.", glow: true },
  ];
  const [displayed, setDisplayed] = useState<string[]>(["", "", ""]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (lineIdx >= lines.length) {
      setDone(true);
      return;
    }
    const line = lines[lineIdx];
    if (charIdx < line.text.length) {
      const timer = setTimeout(() => {
        setDisplayed((prev) => {
          const next = [...prev];
          next[lineIdx] = line.text.slice(0, charIdx + 1);
          return next;
        });
        setCharIdx((c) => c + 1);
      }, 55);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setLineIdx((i) => i + 1);
        setCharIdx(0);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [lineIdx, charIdx, done]);

  useEffect(() => {
    if (done) {
      const blink = setInterval(() => setShowCursor((s) => !s), 700);
      return () => clearInterval(blink);
    }
    const blink = setInterval(() => setShowCursor((s) => !s), 530);
    return () => clearInterval(blink);
  }, [done]);

  return (
    <h1 className="text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl min-h-[3.15em]">
      {lines.map((line, i) => (
        <span key={i} className="block">
          <span className={line.glow ? "text-primary-glow" : ""}>
            {displayed[i]}
          </span>
          {(i === lineIdx || (i === lines.length - 1 && done)) && (
            <span
              className={`inline-block w-[3px] h-[0.85em] align-middle ml-0.5 -translate-y-px ${
                showCursor ? "bg-primary-glow" : "bg-transparent"
              }`}
            />
          )}
        </span>
      ))}
    </h1>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"tracking" | "ship">("tracking");
  const [trackingInput, setTrackingInput] = useState("");
  const [shippingInput, setShippingInput] = useState("");

  const handleTrack = () => {
    const trimmed = trackingInput.trim();
    if (trimmed) {
      navigate({ to: `/tracking?code=${encodeURIComponent(trimmed)}` });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tab === "tracking") {
      handleTrack();
    }
  };

  return (
    <section className="relative overflow-hidden bg-background pb-20">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={heroTruck}
            alt="Red logistics truck driving at sunset with cargo plane"
            className="h-[520px] w-full object-cover sm:h-[600px]"
            width={1600}
            height={1024}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-12">
            <div className="max-w-2xl animate-fade-up">
              <TypewriterText />
            </div>
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
              <div className="w-full max-w-md rounded-xl bg-white p-2 shadow-2xl animate-fade-up">
                <div className="flex border-b border-border">
                  {(["tracking", "ship"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`relative flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                        tab === t ? "text-primary" : "text-muted-foreground hover:text-navy"
                      }`}
                    >
                      {t === "tracking" ? "Tracking Order" : "Ship Order"}
                      {tab === t && (
                        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="p-3">
                  <div className="mb-3 flex items-center gap-2 rounded-md border border-border px-3 py-2.5">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <input
                      value={tab === "tracking" ? trackingInput : shippingInput}
                      onChange={(e) => (tab === "tracking" ? setTrackingInput(e.target.value) : setShippingInput(e.target.value))}
                      onKeyDown={handleKeyDown}
                      placeholder={tab === "tracking" ? "Type your tracking number here" : "Where to ship?"}
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                  <button
                    onClick={() => tab === "tracking" && handleTrack()}
                    disabled={tab === "tracking" && !trackingInput.trim()}
                    className="btn-shine w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                  >
                    {tab === "tracking" ? "Track" : "Get Quote"}
                  </button>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Multiple Tracking Numbers</span>
                    <a href="#" className="text-primary hover:underline">Need Help</a>
                  </div>
                </div>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-white/85">
                We are your dependable partner for delivering your precious items and ensuring your products reach their destination safely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SERVICE CARDS ---------- */
function ServiceCards() {
  const cards = [
    { icon: Package, title: "Shipment Now", desc: "Smooth Shipping Experience. No Registration Needed!", highlight: false },
    { icon: Monitor, title: "Get Transit time & Rate", desc: "Get transit time and cost of your shipment", highlight: true },
    { icon: MapPin, title: "Logist for Business", desc: "Look up rates for new shipments and inland tariffs.", highlight: false },
  ];
  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-3xl font-bold text-navy sm:text-4xl">
          Anything you need, <span className="text-muted-foreground">we're here to help</span>
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <div
              key={c.title}
              className={`hover-lift group rounded-2xl p-8 transition-all ${
                c.highlight
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-brand)]"
                  : "bg-secondary text-navy"
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`mb-6 inline-flex h-20 w-20 items-center justify-center rounded-xl ${c.highlight ? "bg-white/15" : "bg-white"}`}>
                <c.icon className={`h-10 w-10 ${c.highlight ? "text-white" : "text-primary"}`} />
              </div>
              <h3 className="mb-2 text-xl font-bold">{c.title}</h3>
              <p className={`mb-6 text-sm ${c.highlight ? "text-white/85" : "text-muted-foreground"}`}>{c.desc}</p>
              <button className={`btn-shine inline-flex items-center justify-center rounded-md px-6 py-2.5 text-sm font-semibold transition-transform hover:scale-105 active:scale-95 ${
                c.highlight ? "bg-navy text-navy-foreground" : "bg-navy text-navy-foreground"
              }`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- STATS & WHY ---------- */
function StatsAndWhy() {
  const stats = [
    { value: "7M+", label: "Delivered parcels, missions complete." },
    { value: "30K+", label: "Business served, needs met, goals achieved." },
    { value: "3500+", label: "Total Worldwide Agent, serving without borders." },
  ];
  const features = [
    { icon: MapPin, title: "Full Tracking", desc: "Track your parcel status in real-time.", color: "bg-white" },
    { icon: DollarSign, title: "Lowest Pricing", desc: "Competitive rates for cost-effective shipping.", color: "bg-white" },
    { icon: Truck, title: "Wide Coverage", desc: "Extensive network for comprehensive delivery.", color: "bg-white" },
    { icon: ThumbsUp, title: "Experience", desc: "Delivering shipments for decades successfully!", color: "bg-white" },
    { icon: Shield, title: "Reliable", desc: "A secure service you can trust.", color: "bg-yellow text-navy" },
    { icon: ShieldCheck, title: "Transit Insurance", desc: "Protecting your shipment from origin to destination.", color: "bg-white" },
  ];
  return (
    <section className="relative overflow-hidden bg-navy text-navy-foreground">
      <div className="absolute -right-32 top-1/3 h-64 w-64 rounded-full border border-white/10 animate-spin-slow" />
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-16 md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.value}>
              <div className="text-5xl font-bold text-primary md:text-6xl">{s.value}</div>
              <p className="mt-3 text-sm text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="rounded-xl bg-primary p-8 text-primary-foreground shadow-[var(--shadow-brand)]">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest opacity-90">Why Choose Us</div>
            <h3 className="mb-4 text-3xl font-bold leading-tight">Why we're the go to Shipment Partner.</h3>
            <p className="text-sm text-white/90">
              We deliver parcels worldwide, ensuring their safety throughout the journey, with eco-friendly practices and affordable pricing.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className={`hover-lift rounded-xl p-5 text-navy ${f.color}`}
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-navy text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold">{f.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SERVICE OFFERINGS ---------- */
function ServiceOfferings() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">Service Offerings</div>
          <h2 className="text-4xl font-bold text-navy">
            Seamless Logistics <span className="text-muted-foreground">Solution</span>
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <OfferingCard bg="bg-primary" textColor="text-primary-foreground" title="Air Cargo Services"
            desc="Effective solutions for urgent circumstances seeking quick delivery with our Air Cargo Express service."
            tags={["Documents", "Parcels", "Security", "International", "Last Mile", "Daily Flights"]} img={airCargo} alt="Air cargo plane" />
          <OfferingCard bg="bg-yellow" textColor="text-navy" title="Ocean Freight & Logistics"
            desc="We are offering efficient shipping solutions for large-scale cargo and bulk shipments across international waters."
            tags={["Freight", "Compliance", "Warehousing", "Heavylifting", "Customs Clearance"]} img={oceanFreight} alt="Cargo ship" />
        </div>
        <div className="mt-6">
          <OfferingCard wide bg="bg-teal" textColor="text-navy" title="Land Freight Services"
            desc="Our Land Freight Express service delivers shipments rapidly and reliably inside the country."
            tags={["Documents", "Real-time updates", "Parcels", "24/7 Customer Support", "Domestic"]} img={landFreight} alt="Land freight trucks" />
        </div>
      </div>
    </section>
  );
}

function OfferingCard({
  bg, textColor, title, desc, tags, img, alt, wide,
}: {
  bg: string; textColor: string; title: string; desc: string; tags: string[]; img: string; alt: string; wide?: boolean;
}) {
  return (
    <div className={`hover-lift overflow-hidden rounded-2xl ${bg} ${textColor}`}>
      <div className={`p-8 ${wide ? "md:grid md:grid-cols-2 md:items-center md:gap-6" : ""}`}>
        <div>
          <h3 className="mb-3 text-2xl font-bold">{title}</h3>
          <p className={`mb-5 text-sm ${textColor === "text-navy" ? "text-navy/75" : "text-white/85"}`}>{desc}</p>
          <div className="mb-5 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className={`rounded-full border px-3 py-1 text-xs font-medium ${
                textColor === "text-navy" ? "border-navy/15 bg-white/40" : "border-white/30 bg-white/15"
              }`}>{t}</span>
            ))}
          </div>
        </div>
        <img src={img} alt={alt} loading="lazy" className={`w-full rounded-lg object-cover ${wide ? "h-48 md:h-56" : "h-48"}`} />
      </div>
    </div>
  );
}

/* ---------- TESTIMONIALS ---------- */
function Testimonials() {
  const items = [
    { name: "Elona Mosco", role: "Head of Designer @ Musermind", text: "Transpo's team is always helpful and cooperative. They helped shifting my apartment items without much hassle!" },
    { name: "Marvin McKinney", role: "Marketing Coordinator", text: "Transpo always delivers on time. That's why I trust them with my products!" },
  ];
  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_2fr]">
        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-widest opacity-90">Testimonial</div>
          <h2 className="mb-4 text-4xl font-bold leading-tight">See What Real Customers Say About Transpo</h2>
          <p className="mb-8 text-sm text-white/85">
            We value the trust you place in us with your valuable items and will work hard to keep it throughout our service.
          </p>
          <div className="flex gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-transform hover:scale-110 active:scale-95">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform hover:scale-110 active:scale-95">
              <ChevronRight className="h-5 w-5 text-primary" />
            </button>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((t) => (
            <div key={t.name} className="rounded-xl bg-white p-6 text-navy hover-lift">
              <Quote className="mb-3 h-6 w-6 text-primary" />
              <p className="mb-6 text-sm leading-relaxed">{t.text}</p>
              <div>
                <div className="text-sm font-bold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  const faqs = [
    "What happens if my parcel is lost or damaged during shipping?",
    "Do you offer any discounts for regular customers?",
    "Can I customize my shipping preferences, such as delivery speed or packaging options?",
    "Are there any additional fees I should be aware of?",
    "Where can these ships operate?",
    "How do I arrange for a return or exchange if needed?",
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-background py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-xl bg-navy p-8 text-navy-foreground">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">FAQ</div>
          <h2 className="mb-5 text-3xl font-bold leading-tight">Quick Responses to Common Questions Await You Here.</h2>
          <p className="text-sm text-white/70">Can't find what you're looking for? Contact us here:</p>
          <p className="mt-1 text-sm font-semibold text-primary">info@logist.com</p>
        </div>
        <div className="space-y-2">
          {faqs.map((q, i) => (
            <button
              key={q}
              onClick={() => setOpen(open === i ? -1 : i)}
              className="hover-lift block w-full rounded-lg border border-border bg-white p-5 text-left transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-navy">{q}</span>
                <ChevronDown className={`h-5 w-5 flex-shrink-0 text-primary transition-transform ${open === i ? "rotate-180" : ""}`} />
              </div>
              <div className={`grid overflow-hidden text-sm text-muted-foreground transition-all ${open === i ? "mt-3 grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  Our team will respond promptly with a tailored solution that fits your shipment needs.
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- ARTICLES ---------- */
function Articles() {
  const items = [
    { img: articlePort, tag: "Sustainable Shipping", title: "Reducing Carbon Footprint in Logistics" },
    { img: articleEcom, tag: "Logistics & Business", title: "The Ultimate E-Commerce Competitor Analysis Template" },
    { img: articleWarehouse, tag: "Technology in Logistics", title: "Optimizing Supply Chain Management" },
  ];
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">News & Article</div>
          <h2 className="text-4xl font-bold text-navy">Latest <span className="text-muted-foreground">Articles</span></h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((a) => (
            <a key={a.title} href="#" className="group block">
              <div className="overflow-hidden rounded-xl">
                <img src={a.img} alt={a.title} loading="lazy" width={800} height={640} className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="mt-4">
                <div className="text-xs font-bold uppercase tracking-widest text-primary">{a.tag}</div>
                <h3 className="mt-2 text-lg font-bold text-navy transition-colors group-hover:text-primary">{a.title}</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-navy/70 transition-all group-hover:gap-2 group-hover:text-primary">
                  Read more <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

