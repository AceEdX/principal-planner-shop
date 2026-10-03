CREATE TABLE public.prebook_orders_2027_28 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  school text,
  address text,
  city text,
  pincode text,
  quantity integer NOT NULL DEFAULT 1,
  amount integer NOT NULL,
  payment_id text,
  order_id text UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.prebook_orders_2027_28 TO service_role;

ALTER TABLE public.prebook_orders_2027_28 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny all client access to 2027-28 prebook orders"
  ON public.prebook_orders_2027_28
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);