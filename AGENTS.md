# Project Architecture Rules

- Treat `site_config.price_config` as the source of truth for checkout pricing; the browser may display totals but must never determine the Razorpay amount.
- Store 2027–28 orders only in `prebook_orders_2027_28`; keep `prebook_orders` unchanged as historical data.
- Verify Razorpay payment signatures server-side before marking an order paid, because browser callbacks are untrusted.
- Keep admin password verification server-side and handle rejected requests inline with cleared loading states, so authentication failures never blank the admin page.