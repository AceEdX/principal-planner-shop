

## Admin Price Management System

Currently, the price is hardcoded in `src/components/PrebookSection.tsx` at lines 8-15. To give you super admin access to change prices without editing code, I'll implement a database-backed configuration system with a protected admin panel.

### What Will Be Built:

**1. Database Configuration Table**
- Create a `site_config` table in Supabase to store editable pricing values
- Stores: `originalPrice`, `salePrice`, `prebookingOpen` toggle, `deliveryNote`
- The landing page will fetch these values on load

**2. Protected Admin Page (`/admin`)**
- Simple login form with a password (stored as a secret)
- Price editing form showing current values
- Fields: Original Price (MRP), Sale Price, Pre-booking toggle, Delivery Note
- Save button updates the database instantly

**3. Updated PrebookSection**
- Replace hardcoded `PRICE_CONFIG` with fetched values from database
- Add loading state while config fetches
- Keep `RAZORPAY_KEY` in environment variables for security

### Technical Details:

| Component | Implementation |
|-----------|----------------|
| Database | `site_config` table with `key` and `value` columns (JSON storage) |
| Admin Auth | Simple password protection (env var: `ADMIN_PASSWORD`) |
| Data Fetching | React Query or useEffect to load prices on page mount |
| Real-time Updates | Optional: Subscribe to config changes so price updates appear immediately |

### Admin Access Flow:
1. Navigate to `your-site.com/admin`
2. Enter admin password (only you know it)
3. Edit prices in the form
4. Click Save — changes reflect immediately on the landing page

### Security:
- Admin page requires password
- Database write access restricted to authenticated admin sessions
- Price data is read-only for public visitors

