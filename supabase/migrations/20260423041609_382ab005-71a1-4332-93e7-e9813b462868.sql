
CREATE TABLE public.site_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Anyone can read config (prices are public)
CREATE POLICY "Anyone can read site config"
  ON public.site_config
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert default pricing config
INSERT INTO public.site_config (key, value) VALUES (
  'price_config',
  '{"originalPrice": 999, "salePrice": 699, "prebookingOpen": true, "deliveryNote": "Expected dispatch: June 2026"}'::jsonb
);
