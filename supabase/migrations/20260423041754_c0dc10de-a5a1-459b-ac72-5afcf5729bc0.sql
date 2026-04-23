
CREATE POLICY "Allow updates to site config"
  ON public.site_config
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
