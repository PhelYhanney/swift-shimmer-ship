-- 1) Remove the overly-permissive public SELECT on shipments (exposed PII)
DROP POLICY IF EXISTS "Public can view shipments by tracking number" ON public.shipments;

-- Admins keep full read access
CREATE POLICY "Admins can view shipments"
ON public.shipments
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2) Lock down public read of shipment_events too (only via function)
DROP POLICY IF EXISTS "Public can view shipment events" ON public.shipment_events;

CREATE POLICY "Admins can view shipment events"
ON public.shipment_events
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3) Public tracking lookup via SECURITY DEFINER function that EXCLUDES PII
CREATE OR REPLACE FUNCTION public.get_shipment_tracking(_tracking_number text)
RETURNS TABLE (
  tracking_number text,
  status shipment_status,
  service service_type,
  origin text,
  destination text,
  current_location text,
  estimated_delivery date,
  delivered_at timestamptz,
  created_at timestamptz,
  events jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    s.tracking_number,
    s.status,
    s.service,
    s.origin,
    s.destination,
    s.current_location,
    s.estimated_delivery,
    s.delivered_at,
    s.created_at,
    COALESCE(
      (
        SELECT jsonb_agg(jsonb_build_object(
          'status', e.status,
          'location', e.location,
          'notes', e.notes,
          'occurred_at', e.occurred_at
        ) ORDER BY e.occurred_at DESC)
        FROM public.shipment_events e
        WHERE e.shipment_id = s.id
      ), '[]'::jsonb
    ) AS events
  FROM public.shipments s
  WHERE s.tracking_number = btrim(_tracking_number)
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_shipment_tracking(text) TO anon, authenticated;

-- 4) Reduce attack surface: revoke direct EXECUTE on trigger-only definer functions
REVOKE EXECUTE ON FUNCTION public.create_initial_event() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_status_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
