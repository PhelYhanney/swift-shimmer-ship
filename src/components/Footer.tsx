import { Link } from "@tanstack/react-router";
import { Twitter, Instagram, Facebook, Linkedin } from "lucide-react";
import { LogoMark } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <LogoMark light />
          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm placeholder:text-white/50 focus:border-primary focus:outline-none"
            />
            <button className="btn-shine rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95">
              Subscribe
            </button>
          </form>
        </div>
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
          <FooterCol title="Our Company" links={["About Logist", "Careers", "International Holiday Schedule", "Conditions of Carriage", "Binding Corporate Rules", "Contact Us"]} />
          <FooterCol title="Quick Links" links={["Customer Service", "Customer Portal Logins", "Shipment Insurance", "Service Updates", "Get a Quote", "Logist for Business"]} />
          <FooterCol title="Our Service" links={["Express Parcel", "Ocean Freight", "Distribution", "Warehousing", "Cross Border", "Software Platform"]} />
          <div>
            <h4 className="mb-4 text-base font-semibold">Contact Us</h4>
            <p className="text-sm text-white/70 leading-relaxed">
              CargoXite GmbH Liebherrstraße<br />
              20 80538 München Germany
            </p>
            <p className="mt-3 text-sm text-white/70">Logist@example.com</p>
            <p className="mt-1 text-sm text-white/70">(808) 555-0111</p>
          </div>
        </div>
        <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/60">© Transpo 2026. All rights reserved.</p>
          <div className="flex gap-3">
            {[Twitter, Instagram, Facebook, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-all hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="mb-4 text-base font-semibold">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l}>
            <Link to="/" className="text-sm text-white/70 transition-colors hover:text-primary">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}