import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/new")({
  component: NewShipment,
});

const schema = z.object({
  tracking_number: z.string().trim().min(3).max(64),
  customer_name: z.string().trim().min(1).max(100),
  customer_email: z.string().trim().email().max(255).optional().or(z.literal("")),
  customer_phone: z.string().trim().max(30).optional().or(z.literal("")),
  service: z.enum(["air", "ocean", "land"]),
  origin: z.string().trim().min(1).max(200),
  destination: z.string().trim().min(1).max(200),
  current_location: z.string().trim().max(200).optional().or(z.literal("")),
  weight_kg: z.string().optional(),
  estimated_delivery: z.string().optional().or(z.literal("")),
  description: z.string().trim().max(500).optional().or(z.literal("")),
});

function genTracking() {
  return "TRP-" + Math.floor(1000 + Math.random() * 9000) + "-" + Math.random().toString(36).slice(2, 5).toUpperCase();
}

function NewShipment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    tracking_number: genTracking(),
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    service: "land" as "air" | "ocean" | "land",
    origin: "",
    destination: "",
    current_location: "",
    weight_kg: "",
    estimated_delivery: "",
    description: "",
  });

  const update = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase
      .from("shipments")
      .insert({
        tracking_number: parsed.data.tracking_number,
        customer_name: parsed.data.customer_name,
        customer_email: parsed.data.customer_email || null,
        customer_phone: parsed.data.customer_phone || null,
        service: parsed.data.service,
        origin: parsed.data.origin,
        destination: parsed.data.destination,
        current_location: parsed.data.current_location || null,
        weight_kg: parsed.data.weight_kg ? Number(parsed.data.weight_kg) : null,
        estimated_delivery: parsed.data.estimated_delivery || null,
        description: parsed.data.description || null,
        created_by: user?.id,
      })
      .select("id")
      .single();
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Shipment created");
    navigate({ to: "/admin/shipment/$id", params: { id: data.id } });
  };

  const field = "mt-1 w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-primary";
  const label = "text-xs font-semibold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-navy">New shipment</h1>
      <p className="mt-1 text-sm text-muted-foreground">Create a new shipment record. Customers can track it instantly.</p>

      <form onSubmit={onSubmit} className="mt-8 max-w-3xl space-y-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Tracking #</label>
            <div className="mt-1 flex gap-2">
              <input value={form.tracking_number} onChange={(e) => update("tracking_number", e.target.value)} className={field + " mt-0 flex-1 font-mono"} />
              <button type="button" onClick={() => update("tracking_number", genTracking())} className="rounded-md bg-secondary px-3 text-xs font-semibold text-navy hover:bg-secondary/70">
                Regenerate
              </button>
            </div>
          </div>
          <div>
            <label className={label}>Service</label>
            <select value={form.service} onChange={(e) => update("service", e.target.value as "air" | "ocean" | "land")} className={field}>
              <option value="land">Land freight</option>
              <option value="air">Air freight</option>
              <option value="ocean">Ocean freight</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Customer name</label>
            <input required value={form.customer_name} onChange={(e) => update("customer_name", e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>Customer email</label>
            <input type="email" value={form.customer_email} onChange={(e) => update("customer_email", e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>Customer phone</label>
            <input value={form.customer_phone} onChange={(e) => update("customer_phone", e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>Weight (kg)</label>
            <input type="number" step="0.1" value={form.weight_kg} onChange={(e) => update("weight_kg", e.target.value)} className={field} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Origin</label>
            <input required value={form.origin} onChange={(e) => update("origin", e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>Destination</label>
            <input required value={form.destination} onChange={(e) => update("destination", e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>Current location</label>
            <input value={form.current_location} onChange={(e) => update("current_location", e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>Estimated delivery</label>
            <input type="date" value={form.estimated_delivery} onChange={(e) => update("estimated_delivery", e.target.value)} className={field} />
          </div>
        </div>

        <div>
          <label className={label}>Description</label>
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} className={field} />
        </div>

        <div className="flex gap-3">
          <button disabled={submitting} className="btn-shine inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Create shipment
          </button>
          <button type="button" onClick={() => navigate({ to: "/admin" })} className="rounded-md border border-border px-6 py-2.5 text-sm font-semibold text-navy hover:bg-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}