import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency = 'INR', notes } = await req.json()

    if (!amount || typeof amount !== 'number' || amount < 100) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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
      body: JSON.stringify({ amount, currency, notes: notes || {} }),
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

    await supabase.from('prebook_orders').insert({
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
