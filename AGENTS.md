# Project Architecture Rules

- Treat `site_config.price_config` as the source of truth for checkout pricing; the browser may display totals but must never determine the Razorpay amount.
- Store 2027–28 orders only in `prebook_orders_2027_28`; keep `prebook_orders` unchanged as historical data.
- Verify Razorpay payment signatures server-side before marking an order paid, because browser callbacks are untrusted.
- Use Web Crypto HMAC verification for payment signatures and accept retries for the same verified payment, because runtime-specific comparison APIs fail and callbacks may repeat.
- Show checkout success only after server confirmation; retain failed confirmation details for retry without another charge.
- Keep admin password verification server-side and handle rejected requests inline with cleared loading states, so authentication failures never blank the admin page.
- Keep public product facts in `src/lib/product.ts` and use the existing accessible accordion/dialog controls, so delivery, support and coverage stay consistent across purchase and preview views.
- Share booking availability and price through the page context and observe the order button for the mobile purchase bar; hide it during checkout or sample enlargement so purchasing overlays never compete.