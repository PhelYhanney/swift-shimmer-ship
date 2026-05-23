import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

type Req = {
  id: string;
  tracking_number: string;
  found: boolean;
  created_at: string;
  shipment_id: string | null;
};

export const Route = createFileRoute("/_authenticated/admin/requests")({
  component: RequestsPage,
});

function RequestsPage() {
  const [items, setItems] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("tracking_requests")
      .select("id,tracking_number,found,created_at,shipment_id")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-navy">Tracking requests</h1>
      <p className="mt-1 text-sm text-muted-foreground">Last 200 customer tracking lookups.</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No tracking requests yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3 text-left">When</th>
                <th className="px-6 py-3 text-left">Tracking #</th>
                <th className="px-6 py-3 text-left">Result</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-6 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-6 py-3 font-mono text-navy">{r.tracking_number}</td>
                  <td className="px-6 py-3">
                    {r.found ? (
                      <span className="inline-flex items-center gap-1 text-green-700"><CheckCircle2 className="h-4 w-4" /> Found</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600"><XCircle className="h-4 w-4" /> Not found</span>
                    )}
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