
-- prebook_orders: remove all public policies; only service_role via edge functions
DROP POLICY IF EXISTS "Allow inserting orders" ON public.prebook_orders;
DROP POLICY IF EXISTS "Allow reading orders" ON public.prebook_orders;
DROP POLICY IF EXISTS "Allow updating orders" ON public.prebook_orders;

REVOKE ALL ON public.prebook_orders FROM anon, authenticated;
GRANT ALL ON public.prebook_orders TO service_role;

-- No policies granted to anon/authenticated => no access via Data API.
-- service_role bypasses RLS.

-- site_config: keep public read; remove public update. Only service_role can update.
DROP POLICY IF EXISTS "Allow updates to site config" ON public.site_config;

REVOKE UPDATE, INSERT, DELETE ON public.site_config FROM anon, authenticated;
GRANT SELECT ON public.site_config TO anon, authenticated;
GRANT ALL ON public.site_config TO service_role;
