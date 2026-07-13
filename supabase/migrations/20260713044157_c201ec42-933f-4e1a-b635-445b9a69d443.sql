-- Add explicit deny-all policies on prebook_orders to document intent.
-- Access happens only through edge functions using the service_role key, which bypasses RLS.
CREATE POLICY "Deny all client access to prebook_orders"
  ON public.prebook_orders
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);