import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3'

const OrderSchema = z.object({
  currency: z.literal('INR').default('INR'),
  quantity: z.number().int().min(1).max(50),
  notes: z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().email().max(254),
    phone: z.string().trim().min(7).max(20),
    school: z.string().trim().max(200).optional().default(''),
    address: z.string().trim().min(5).max(500),
    city: z.string().trim().min(2).max(100),
    pincode: z.string().regex(/^\d{6}$/),
    quantity: z.string().regex(/^\d+$/),
  }),
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const parsed = OrderSchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Please check the booking details and try again.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    const { currency, quantity, notes } = parsed.data

    // Check the admin-controlled booking switch. There is no automatic time limit.
    const supabaseCheck = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    const { data: cfg } = await supabaseCheck
      .from('site_config')
      .select('value')
      .eq('key', 'price_config')
      .single()

    const config = cfg?.value as { prebookingOpen?: boolean; salePrice?: number } | undefined
    if (!config?.prebookingOpen) {
      return new Response(
        JSON.stringify({ error: 'Orders are no longer accepted for the Handbook & Planner.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const salePrice = config.salePrice
    if (!Number.isInteger(salePrice) || (salePrice ?? 0) < 1) {
      return new Response(
        JSON.stringify({ error: 'Payment configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    const amount = (salePrice ?? 0) * quantity * 100

    const keyId = 'rzp_live_S9yItLCPCKdBpt'
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!keySecret) {
      return new Response(
        JSON.stringify({ error: 'Payment configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const auth = btoa(`${keyId}:${keySecret}`)

    const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency, notes }),
    })

    const orderData = await orderRes.json()

    if (!orderRes.ok) {
      console.error('Razorpay order creation failed:', orderData)
      return new Response(
        JSON.stringify({ error: orderData.error?.description || 'Order creation failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Save order to database with pending status
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { error: insertError } = await supabase.from('prebook_orders_2027_28').insert({
      name: notes?.name || '',
      email: notes?.email || '',
      phone: notes?.phone || '',
      school: notes?.school || '',
      address: notes?.address || '',
      city: notes?.city || '',
      pincode: notes?.pincode || '',
      quantity: parseInt(notes?.quantity || '1'),
      amount,
      order_id: orderData.id,
      status: 'pending',
    })

    if (insertError) {
      console.error('Failed to save pending order:', insertError.message)
      return new Response(
        JSON.stringify({ error: 'Order could not be saved. No payment was taken.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ orderId: orderData.id, amount: orderData.amount, currency: orderData.currency }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
