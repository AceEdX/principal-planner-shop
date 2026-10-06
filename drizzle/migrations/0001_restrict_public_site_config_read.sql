DROP POLICY IF EXISTS "Anyone can read site config" ON public.site_config;

CREATE POLICY "Public can read price config"
ON public.site_config
FOR SELECT
TO anon, authenticated
USING (key = 'price_config');