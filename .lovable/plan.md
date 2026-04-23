

# WhatsApp Payment Notification to 9373387800

## What it does
Every time a customer completes a payment, you automatically receive a WhatsApp message on **9373387800** with all order details: name, email, phone, address, pincode, city, amount, quantity, status, payment ID, order ID, and date/time.

## What you need first
The WhatsApp Business API requires two credentials from Meta:

1. **WhatsApp Access Token** — from [Meta Developer Console](https://developers.facebook.com) → Your App → WhatsApp → API Setup
2. **WhatsApp Phone Number ID** — shown on the same API Setup page (this is the sender number ID, not your personal number)

**Quick setup steps** (if you don't have these yet):
- Go to [developers.facebook.com](https://developers.facebook.com) and create an app with the "WhatsApp" product
- In WhatsApp → API Setup, you'll see your Phone Number ID and can generate an access token
- Add **919373387800** as a recipient in the test numbers (or use a permanent token with an approved template for production)

## Implementation plan

### Step 1 — Store two secrets
- `WHATSAPP_ACCESS_TOKEN` — your Meta API token
- `WHATSAPP_PHONE_NUMBER_ID` — the sender phone number ID

### Step 2 — Update `send-order-email` edge function
After updating the order status to "paid", add a WhatsApp message send via Meta Graph API:
- **Endpoint**: `POST https://graph.facebook.com/v21.0/{PHONE_NUMBER_ID}/messages`
- **Recipient**: `919373387800`
- **Message**: formatted text with all order details (name, email, phone, address+pincode, city, amount, quantity, status, payment ID, order ID, timestamp)
- Errors are logged but don't block the payment confirmation flow

### Step 3 — No frontend changes needed
The notification triggers server-side when the existing `send-order-email` function runs after payment.

## Do you have a Meta Developer account with WhatsApp Business API access?
If yes, I'll ask you to add the two secrets and implement immediately. If not, I can guide you through the setup first.

