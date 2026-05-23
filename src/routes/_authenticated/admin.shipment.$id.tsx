import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Loader2, Save, Clock, MapPin } from "lucide-react";
import { statusLabels, statusColors } from "./admin";

type Shipment = {
  id: string;
  tracking_number: string;
  status: string;
  service: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  origin: string;
  destination: string;
  current_location: string | null;
  weight_kg: number | null;
  description: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  created_at: string;
};

type Event = {
  id: string;
  status: string;
  location: string | null;
  notes: string | null;
  occurred_at: string;
};

export const Route = createFileRoute("/_authenticated/admin/shipment/$id")({
  component: ShipmentDetail,
});

const STATUSES = ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered", "exception", "cancelled"] as const;

function ShipmentDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newStatus, setNewStatus] = useState<string>("");
  const [newLocation, setNewLocation] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const load = useCallback(async () => {
    const [{ data: s }, { data: e }] = await Promise.all([
      supabase.from("shipments").select("*").eq("id", id).maybeSingle(),
      supabase.from("shipment_events").select("*").eq("shipment_id", id).order("occurred_at", { ascending: false }),
    ]);
    setShipment(s as Shipment | null);
    setEvents((e as Event[]) ?? []);
    if (s) setNewStatus(s.status);
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }
  if (!shipment) {
    return <div className="p-10"><p>Shipment not found.</p><Link to="/admin" className="mt-3 inline-block text-primary">Back</Link></div>;
  }

  const updateField = async <K extends keyof Shipment>(key: K, value: Shipment[K]) => {
    setShipment({ ...shipment, [key]: value });
  };

  const saveShipment = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("shipments")
      .update({
        customer_name: shipment.customer_name,
        customer_email: shipment.customer_email,
        customer_phone: shipment.customer_phone,
        origin: shipment.origin,
        destination: shipment.destination,
        current_location: shipment.current_location,
        weight_kg: shipment.weight_kg,
        description: shipment.description,
        estimated_delivery: shipment.estimated_delivery,
        service: shipment.service as "air" | "ocean" | "land",
      })
      .eq("id", shipment.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Shipment updated");
    load();
  };

  const addEvent = async () => {
    if (!newStatus) return toast.error("Pick a status");
    setSaving(true);
    // If status changes, update shipment.status (trigger logs the event automatically)
    if (newStatus !== shipment.status) {
      const { error } = await supabase
        .from("shipments")
        .update({
          status: newStatus as Shipment["status"],
          current_location: newLocation || shipment.current_location,
        })
        .eq("id", shipment.id);
      if (error) { setSaving(false); return toast.error(error.message); }
      // also write the optional notes as a manual event
      if (newNotes) {
        await supabase.from("shipment_events").insert({
          shipment_id: shipment.id,
          status: newStatus as Shipment["status"],
          location: newLocation || null,
          notes: newNotes,
          created_by: user?.id,
        });
      }
    } else {
      // Same status — just log a manual event
      const { error } = await supabase.from("shipment_events").insert({
        shipment_id: shipment.id,
        status: newStatus as Shipment["status"],
        location: newLocation || null,
        notes: newNotes || null,
        created_by: user?.id,
      });
      if (error) { setSaving(false); return toast.error(error.message); }
      if (newLocation) {
        await supabase.from("shipments").update({ current_location: newLocation }).eq("id", shipment.id);
      }
    }
    setSaving(false);
    setNewLocation("");
    setNewNotes("");
    toast.success("Event added");
    load();
  };

  const deleteShipment = async () => {
    if (!confirm(`Delete shipment ${shipment.tracking_number}? This cannot be undone.`)) return;
    const { error } = await supabase.from("shipments").delete().eq("id", shipment.id);
    if (error) return toast.error(error.message);
    toast.success("Shipment deleted");
    navigate({ to: "/admin" });
  };

  const field = "mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary";
  const label = "text-xs font-semibold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="p-6 lg:p-10">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All shipments
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Tracking #</div>
          <div className="font-mono text-2xl font-bold text-navy">{shipment.tracking_number}</div>
          <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusColors[shipment.status]}`}>
            {statusLabels[shipment.status]}
          </span>
        </div>
        <button onClick={deleteShipment} className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Update status panel */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="text-lg font-bold text-navy">Update status</h2>
          <p className="mt-1 text-xs text-muted-foreground">Add a new event to the timeline.</p>
          <div className="mt-4 space-y-3">
            <div>
              <label className={label}>Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className={field}>
                {STATUSES.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Location</label>
              <input value={newLocation} onChange={(e) => setNewLocation(e.target.value)} className={field} placeholder="e.g. Frankfurt Hub" />
            </div>
            <div>
              <label className={label}>Notes</label>
              <textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)} rows={3} className={field} />
            </div>
            <button onClick={addEvent} disabled={saving} className="btn-shine flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Add event
            </button>
          </div>
        </div>

        {/* Edit details */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-navy">Shipment details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><label className={label}>Customer name</label><input value={shipment.customer_name} onChange={(e) => updateField("customer_name", e.target.value)} className={field} /></div>
            <div><label className={label}>Service</label>
              <select value={shipment.service} onChange={(e) => updateField("service", e.target.value)} className={field}>
                <option value="land">Land</option><option value="air">Air</option><option value="ocean">Ocean</option>
              </select>
            </div>
            <div><label className={label}>Email</label><input value={shipment.customer_email ?? ""} onChange={(e) => updateField("customer_email", e.target.value)} className={field} /></div>
            <div><label className={label}>Phone</label><input value={shipment.customer_phone ?? ""} onChange={(e) => updateField("customer_phone", e.target.value)} className={field} /></div>
            <div><label className={label}>Origin</label><input value={shipment.origin} onChange={(e) => updateField("origin", e.target.value)} className={field} /></div>
            <div><label className={label}>Destination</label><input value={shipment.destination} onChange={(e) => updateField("destination", e.target.value)} className={field} /></div>
            <div><label className={label}>Current location</label><input value={shipment.current_location ?? ""} onChange={(e) => updateField("current_location", e.target.value)} className={field} /></div>
            <div><label className={label}>Weight (kg)</label><input type="number" step="0.1" value={shipment.weight_kg ?? ""} onChange={(e) => updateField("weight_kg", e.target.value ? Number(e.target.value) : null)} className={field} /></div>
            <div><label className={label}>Estimated delivery</label><input type="date" value={shipment.estimated_delivery ?? ""} onChange={(e) => updateField("estimated_delivery", e.target.value || null)} className={field} /></div>
          </div>
          <div className="mt-4"><label className={label}>Description</label><textarea value={shipment.description ?? ""} onChange={(e) => updateField("description", e.target.value)} rows={3} className={field} /></div>
          <div className="mt-5">
            <button onClick={saveShipment} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-navy">Event timeline</h2>
        <div className="mt-5 space-y-5">
          {events.length === 0 && <p className="text-sm text-muted-foreground">No events yet.</p>}
          {events.map((ev, i) => (
            <div key={ev.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-navy"}`}>
                  <Clock className="h-4 w-4" />
                </div>
                {i < events.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
              </div>
              <div className="flex-1 pb-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[ev.status]}`}>{statusLabels[ev.status]}</span>
                  <span className="text-xs text-muted-foreground">{new Date(ev.occurred_at).toLocaleString()}</span>
                </div>
                {ev.location && <div className="mt-1 flex items-center gap-1 text-sm text-navy"><MapPin className="h-3 w-3" /> {ev.location}</div>}
                {ev.notes && <p className="mt-1 text-sm text-muted-foreground">{ev.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}