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
    const { name, email, quantity, amount, address, city, pincode, school, paymentId, orderId } = await req.json()

    if (!email || !name || !orderId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update order status to paid
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    await supabase
      .from('prebook_orders')
      .update({ status: 'paid', payment_id: paymentId })
      .eq('order_id', orderId)

    console.log(`Order PAID: ${name} (${email}), Payment: ${paymentId}, Order: ${orderId}, Qty: ${quantity}, Amount: ₹${amount / 100}`)
    console.log(`Shipping: ${address}, ${city} - ${pincode}`)

    return new Response(
      JSON.stringify({ success: true, message: 'Order confirmed and status updated to paid' }),
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
