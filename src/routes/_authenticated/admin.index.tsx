import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Package, Search, Loader2 } from "lucide-react";
import { statusColors, statusLabels } from "./admin";

type Shipment = {
  id: string;
  tracking_number: string;
  status: string;
  service: string;
  customer_name: string;
  origin: string;
  destination: string;
  current_location: string | null;
  estimated_delivery: string | null;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/admin/")({
  component: ShipmentList,
});

function ShipmentList() {
  const [items, setItems] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase
      .from("shipments")
      .select("id,tracking_number,status,service,customer_name,origin,destination,current_location,estimated_delivery,created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = items.filter((s) => {
    if (!q) return true;
    const t = q.toLowerCase();
    return (
      s.tracking_number.toLowerCase().includes(t) ||
      s.customer_name.toLowerCase().includes(t) ||
      s.destination.toLowerCase().includes(t)
    );
  });

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy">Shipments</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage all shipments and update their status.</p>
        </div>
        <Link
          to="/admin/new"
          className="btn-shine rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          + New shipment
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-md border border-border bg-white px-4 py-2.5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by tracking #, customer, or destination"
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No shipments yet. Create your first one.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3 text-left">Tracking #</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Route</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">ETA</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t border-border transition-colors hover:bg-secondary/30">
                  <td className="px-6 py-4 font-mono font-semibold text-navy">{s.tracking_number}</td>
                  <td className="px-6 py-4">{s.customer_name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{s.origin} → {s.destination}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[s.status]}`}>
                      {statusLabels[s.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{s.estimated_delivery ?? "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <Link to="/admin/shipment/$id" params={{ id: s.id }} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                      <Eye className="h-4 w-4" /> Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}