import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3'

const ConfirmationSchema = z.object({
  paymentId: z.string().min(1).max(100),
  orderId: z.string().min(1).max(100),
  signature: z.string().regex(/^[a-f0-9]{64}$/i),
}).passthrough()

const toHex = (bytes: ArrayBuffer) =>
  Array.from(new Uint8Array(bytes)).map((byte) => byte.toString(16).padStart(2, '0')).join('')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const parsed = ConfirmationSchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid payment confirmation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    const { paymentId, orderId, signature } = parsed.data
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!keySecret) throw new Error('Payment secret is not configured')

    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(keySecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    )
    const expected = toHex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${orderId}|${paymentId}`)))
    if (expected.length !== signature.length || !crypto.subtle.timingSafeEqual(
      new TextEncoder().encode(expected), new TextEncoder().encode(signature.toLowerCase())
    )) {
      return new Response(
        JSON.stringify({ error: 'Payment verification failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: order, error } = await supabase
      .from('prebook_orders_2027_28')
      .update({ status: 'paid', payment_id: paymentId })
      .eq('order_id', orderId)
      .eq('status', 'pending')
      .select('name,email,quantity,amount')
      .single()

    if (error || !order) {
      return new Response(
        JSON.stringify({ error: 'Order could not be confirmed' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Order PAID: ${order.name} (${order.email}), Payment: ${paymentId}, Order: ${orderId}, Qty: ${order.quantity}, Amount: ₹${order.amount / 100}`)

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
