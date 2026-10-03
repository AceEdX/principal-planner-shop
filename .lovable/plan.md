## Reopen Principal's Handbook & Planner 2027–28 Orders

### Page updates
- Replace the main book image with the supplied 2027–28 promotional image.
- Update remaining 2026–27 text to 2027–28 and set the offer to ₹1,499 from ₹1,999.
- Keep the existing testimonials unchanged, as selected.
- Add restrained orange accents through the existing design theme.
- Update the interior teaser images so visible academic-year references read 2027–28 while retaining the intentionally reduced, obscured previews.

### New booking records
- Preserve the existing `prebook_orders` records unchanged for historical reference.
- Create a separate locked-down table for 2027–28 bookings.
- Route new pending and paid bookings into the new table only.

### Payments and checks
- Reopen ordering in the live pricing settings with ₹1,999 original and ₹1,499 pre-booking pricing.
- Keep the backend price authoritative so visitors cannot alter the amount sent to Razorpay.
- Deploy the updated payment functions and verify order creation reaches Razorpay without capturing a payment.
- Confirm the landing page loads the new image, pricing, open booking form, previews, and payment script without errors.
