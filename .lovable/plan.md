## Close Pre-booking Orders for Handbook & Planner

The user wants to stop accepting new orders and payments. This requires changes in three places:

### 1. Database — Update site config flag
Set `prebookingOpen: false` in the `price_config` row of `site_config` table.

### 2. Backend — Protect order creation endpoint
Update the `create-razorpay-order` Edge Function to check `prebookingOpen` in `site_config` before creating a Razorpay order. If closed, return a clear error: "Orders are no longer accepted for the Handbook & Planner."

### 3. Frontend — Show clear "orders closed" message
Update `PrebookSection.tsx` to display a prominent message when prebooking is closed: "Orders are no longer accepted for this Handbook and Planner." Replace the form with this notice and disable/hide the payment button.

### Technical details
- Read `price_config` from `site_config` in the Edge Function
- Return 400 with descriptive error when `prebookingOpen` is false
- Frontend already reads this config, so mostly need to improve the closed-state UI
- Keep the pricing card visible for reference, but disable the form