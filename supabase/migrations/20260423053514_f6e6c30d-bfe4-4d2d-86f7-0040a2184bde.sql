
CREATE TABLE public.prebook_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  school TEXT,
  address TEXT,
  city TEXT,
  pincode TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  amount INTEGER NOT NULL,
  payment_id TEXT,
  order_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.prebook_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow inserting orders" ON public.prebook_orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow reading orders" ON public.prebook_orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow updating orders" ON public.prebook_orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
