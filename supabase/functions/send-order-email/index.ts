import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function sendWhatsAppNotification(details: {
  name: string; email: string; phone: string; address: string;
  city: string; pincode: string; amount: number; quantity: number;
  paymentId: string; orderId: string; school: string;
}) {
  const accessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
  const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')

  if (!accessToken || !phoneNumberId) {
    console.error('WhatsApp credentials not configured')
    return
  }

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const message = `🛒 *New Payment Received!*

👤 *Name:* ${details.name}
📧 *Email:* ${details.email}
📱 *Phone:* ${details.phone || 'N/A'}
🏫 *School:* ${details.school || 'N/A'}

📍 *Address:* ${details.address || 'N/A'}
🏙️ *City:* ${details.city || 'N/A'}
📮 *Pincode:* ${details.pincode || 'N/A'}

💰 *Amount:* ₹${details.amount / 100}
📊 *Status:* PAID ✅
📦 *Quantity:* ${details.quantity}

🆔 *Payment ID:* ${details.paymentId}
🔖 *Order ID:* ${details.orderId}

📅 *Date:* ${dateStr}
🕐 *Time:* ${timeStr}`

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: '919373387800',
        type: 'text',
        text: { body: message },
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      console.error('WhatsApp API error:', JSON.stringify(data))
    } else {
      console.log('WhatsApp notification sent successfully:', data.messages?.[0]?.id)
    }
  } catch (err) {
    console.error('WhatsApp send failed:', err)
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, quantity, amount, address, city, pincode, school, paymentId, orderId, phone } = await req.json()

    if (!email || !name || !orderId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    await supabase
      .from('prebook_orders')
      .update({ status: 'paid', payment_id: paymentId })
      .eq('order_id', orderId)

    console.log(`Order PAID: ${name} (${email}), Payment: ${paymentId}, Order: ${orderId}, Qty: ${quantity}, Amount: ₹${amount / 100}`)

    // Send WhatsApp notification (non-blocking)
    sendWhatsAppNotification({ name, email, phone: phone || '', address: address || '', city: city || '', pincode: pincode || '', amount, quantity, paymentId, orderId, school: school || '' })
      .catch(err => console.error('WhatsApp notification error:', err))

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
