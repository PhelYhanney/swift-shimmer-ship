import { Link } from "@tanstack/react-router";
import { Phone, Menu, X, LogOut, LayoutDashboard, LogIn } from "lucide-react";
import { useState } from "react";
import { LogoMark } from "./Logo";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shipping", label: "Shipping" },
  { to: "/tracking", label: "Tracking" },
  { to: "/support", label: "Support" },
  { to: "/career", label: "Career" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    setOpen(false);
  };
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="transition-transform hover:scale-[1.02]">
          <LogoMark />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="relative text-sm font-medium text-navy/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: true }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <a href="tel:+12015550119" className="flex items-center gap-2 text-sm font-semibold text-navy">
            <Phone className="h-4 w-4 text-primary" /> (201) 555-0119
          </a>
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-sm font-semibold text-navy/80 transition-colors hover:text-primary"
            >
              <LayoutDashboard className="h-4 w-4" /> Admin
            </Link>
          )}
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm font-semibold text-navy/80 transition-colors hover:text-primary"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-sm font-semibold text-navy/80 transition-colors hover:text-primary"
            >
              <LogIn className="h-4 w-4" /> Login
            </Link>
          )}
          <Link
            to="/support"
            className="btn-shine rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition-all hover:scale-[1.03] hover:bg-primary-glow active:scale-95"
          >
            Get Started
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-navy" aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col gap-3 px-6 py-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-navy"
              >
                {n.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 text-base font-medium text-navy"
              >
                <LayoutDashboard className="h-4 w-4" /> Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-left text-base font-medium text-navy"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 text-base font-medium text-navy"
              >
                <LogIn className="h-4 w-4" /> Login
              </Link>
            )}
            <Link
              to="/support"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}