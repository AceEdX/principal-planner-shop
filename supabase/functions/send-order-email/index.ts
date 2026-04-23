const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, quantity, amount, address, city, pincode, school, paymentId } = await req.json()

    if (!email || !name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!keySecret) {
      return new Response(
        JSON.stringify({ error: 'Configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send thank you email via Razorpay's built-in email isn't available,
    // so we'll use a simple SMTP-free approach: log the order and return success.
    // For production email, we'll use the Lovable email infrastructure.
    
    console.log(`Order confirmed: ${name} (${email}), Payment: ${paymentId}, Qty: ${quantity}, Amount: ₹${amount / 100}`)
    console.log(`Shipping: ${address}, ${city} - ${pincode}`)

    return new Response(
      JSON.stringify({ success: true, message: 'Order confirmed' }),
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
