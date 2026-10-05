import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-password',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const adminPassword = Deno.env.get('ADMIN_PASSWORD')
    const provided = req.headers.get('x-admin-password')

    if (!adminPassword || !provided || provided !== adminPassword) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action, config } = await req.json()

    if (action === 'verify') {
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!config || typeof config !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid config' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Whitelist and coerce allowed fields
    const allowed: Record<string, unknown> = {}
    if (typeof config.originalPrice === 'number') allowed.originalPrice = config.originalPrice
    if (typeof config.salePrice === 'number') allowed.salePrice = config.salePrice
    if (typeof config.prebookingOpen === 'boolean') allowed.prebookingOpen = config.prebookingOpen
    if (typeof config.deliveryNote === 'string') allowed.deliveryNote = config.deliveryNote.slice(0, 500)
    if (typeof config.reopenNotice === 'string') allowed.reopenNotice = config.reopenNotice.slice(0, 500)
    if (typeof config.ordersCloseAt === 'string') allowed.ordersCloseAt = config.ordersCloseAt.slice(0, 100)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Merge with existing so we don't wipe fields not sent
    const { data: existing } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'price_config')
      .single()

    const merged = { ...(existing?.value as object || {}), ...allowed }

    const { error } = await supabase
      .from('site_config')
      .update({ value: merged, updated_at: new Date().toISOString() })
      .eq('key', 'price_config')

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, value: merged }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('admin-update-config error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
