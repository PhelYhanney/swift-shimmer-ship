import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { LogoMark } from "@/components/Logo";
import { LayoutDashboard, PackagePlus, ListChecks, LogOut, Eye, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Transpo" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Shipments", icon: LayoutDashboard, exact: true },
  { to: "/admin/new", label: "New shipment", icon: PackagePlus, exact: false },
  { to: "/admin/requests", label: "Tracking requests", icon: ListChecks, exact: false },
] as const;

function AdminLayout() {
  const { isAdmin, loading, signOut, user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error("Admin access required");
      navigate({ to: "/" });
    }
  }, [loading, isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <aside className="hidden w-64 flex-col border-r border-border bg-white md:flex">
        <div className="border-b border-border px-6 py-5">
          <Link to="/"><LogoMark /></Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-6">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all ${
                  active ? "bg-primary text-primary-foreground shadow-[var(--shadow-brand)]" : "text-navy hover:bg-secondary"
                }`}
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <div className="mb-3 truncate text-xs text-muted-foreground">{user?.email}</div>
          <Link to="/" className="mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-navy hover:bg-secondary">
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
          <button
            onClick={async () => { await signOut(); navigate({ to: "/" }); }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-navy hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div className="border-b border-border bg-white px-6 py-4 md:hidden">
          <Link to="/"><LogoMark /></Link>
          <div className="mt-3 flex flex-wrap gap-2">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-navy">
                {n.label}
              </Link>
            ))}
            <button onClick={async () => { await signOut(); navigate({ to: "/" }); }} className="rounded-md bg-navy px-3 py-1.5 text-xs font-semibold text-white">
              Sign out
            </button>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

export const statusLabels: Record<string, string> = {
  pending: "Pending",
  picked_up: "Picked up",
  in_transit: "In transit",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  exception: "Exception",
  cancelled: "Cancelled",
};

export const statusColors: Record<string, string> = {
  pending: "bg-muted text-navy",
  picked_up: "bg-yellow text-navy",
  in_transit: "bg-primary/15 text-primary",
  out_for_delivery: "bg-teal/20 text-teal",
  delivered: "bg-green-100 text-green-800",
  exception: "bg-red-100 text-red-700",
  cancelled: "bg-muted text-muted-foreground",
};

export { Eye };