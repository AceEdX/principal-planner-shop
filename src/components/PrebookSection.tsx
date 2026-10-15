import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, BookOpen, Gift, IndianRupee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const RAZORPAY_KEY = "rzp_live_S9yItLCPCKdBpt";

type PaymentConfirmation = { paymentId: string; orderId: string; signature: string };

const getCheckoutError = async (error: unknown, fallback: string) => {
  const context = (error as { context?: Response } | null)?.context;
  if (context instanceof Response) {
    try {
      const body = await context.clone().json();
      if (typeof body.error === "string") return body.error;
    } catch { /* Use fallback when the response is not JSON. */ }
  }
  return fallback;
};

const loadCheckout = async () => {
  if ((window as any).Razorpay) return;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    const timeout = window.setTimeout(() => reject(new Error("Payment checkout could not load. Check your connection and try again.")), 15000);
    script.onload = () => { window.clearTimeout(timeout); resolve(); };
    script.onerror = () => { window.clearTimeout(timeout); reject(new Error("Payment checkout could not load. Please try again.")); };
    document.head.appendChild(script);
  });
};

const PrebookSection = () => {
  const [priceConfig, setPriceConfig] = useState({
    originalPrice: 1999,
    salePrice: 1499,
    prebookingOpen: true,
    deliveryNote: "",
    reopenNotice: "",
  });
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
      const { data, error } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "price_config")
        .single();
      if (error || !data) throw new Error("Settings unavailable");
      if (data) {
        setPriceConfig(data.value as typeof priceConfig);
      }
      setConfigLoaded(true);
      } catch {
        setPaymentError("Unable to load booking settings. Please refresh and try again.");
      }
    };
    fetchPricing();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    school: "",
    address: "",
    city: "",
    pincode: "",
    quantity: 1,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [confirmation, setConfirmation] = useState<PaymentConfirmation | null>(null);

  const confirmPayment = async (details: PaymentConfirmation) => {
    setLoading(true);
    setPaymentError("");
    try {
      const { data, error } = await supabase.functions.invoke('send-order-email', { body: details });
      if (error || !data?.success) {
        throw new Error(await getCheckoutError(error, data?.error || "Unable to verify the payment right now."));
      }
      setConfirmation(null);
      setSuccess(true);
    } catch {
      setPaymentError(`Payment confirmation is pending for ${details.orderId}. If money was debited, do not pay again. Retry confirmation below or contact AceEdX with payment ID ${details.paymentId}.`);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = priceConfig.salePrice * formData.quantity;
  const savings = (priceConfig.originalPrice - priceConfig.salePrice) * formData.quantity;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Math.max(1, parseInt(value) || 1) : value,
    }));
  };

  const handlePayment = async () => {
    if (loading || confirmation || !configLoaded) return;
    setPaymentError("");
    if (!priceConfig.prebookingOpen) {
      setPaymentError("Orders are no longer accepted for this Handbook and Planner.");
      return;
    }
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      setPaymentError("Please fill in all required fields (name, email, phone, address, city, pincode).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) || !/^\d{6}$/.test(formData.pincode.trim())) {
      setPaymentError("Please enter a valid email address and six-digit pincode.");
      return;
    }
    if (formData.quantity > 50 || formData.address.trim().length < 5 || formData.city.trim().length < 2) {
      setPaymentError("Please check your address, city, and quantity (1–50 copies).");
      return;
    }

    setLoading(true);

    try {
      await loadCheckout();
      // Create order on server
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          currency: 'INR',
          quantity: formData.quantity,
          notes: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            school: formData.school,
            address: formData.address,
            city: formData.city,
            pincode: formData.pincode.trim(),
            quantity: formData.quantity.toString(),
          },
        },
      });

      if (orderError || !orderData?.orderId) {
        throw new Error(await getCheckoutError(orderError, orderData?.error || 'Failed to create order. Please try again.'));
      }

      const options = {
        key: orderData.keyId || RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "AceEdX",
        description: `Principal's Handbook & Planner 2027-28 (x${formData.quantity})`,
        handler: async function (response: any) {
          const details = {
            paymentId: response.razorpay_payment_id,
            orderId: orderData.orderId,
            signature: response.razorpay_signature,
          };
          setConfirmation(details);
          await confirmPayment(details);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          school: formData.school,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          quantity: formData.quantity.toString(),
        },
        theme: {
          color: "#1a2744",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        setPaymentError(response.error?.description || "Payment was not completed. Please try another payment method.");
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      setPaymentError(err.message || "Payment gateway error. Please refresh and try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section id="prebook" className="py-20 lg:py-28 bg-cream">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center bg-card rounded-2xl p-12 shadow-xl"
          >
            <div className="w-20 h-20 rounded-full gradient-gold flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-navy" />
            </div>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Pre-Booking Confirmed! 🎉
            </h2>
            <p className="font-body text-muted-foreground text-lg">
              Thank you, {formData.name}! Your copy of the Principal's Handbook & Planner is reserved.
            </p>
            <p className="font-body text-sm text-muted-foreground mt-2">
              Shipping to: {formData.address}, {formData.city} — {formData.pincode}
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="prebook" className="py-20 lg:py-28 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <a href="https://www.aceedx.com" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-gold font-semibold hover:underline">
            www.aceedx.com
          </a>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-body text-sm font-semibold text-gold tracking-widest uppercase">
            Reserve Your Copy
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-navy mt-3">
            Pre-Book Today & Save
          </h2>
          <p className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">
            Limited copies available. Pre-book now to secure your planner at the special launch price.
          </p>
        </motion.div>

        {priceConfig.prebookingOpen && configLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-10 bg-gold-pale border-2 border-gold rounded-2xl p-6 text-center shadow-lg"
          >
            <h3 className="font-display text-2xl md:text-3xl font-bold text-navy mb-3">
              The Much-Awaited 2027–28 Edition
            </h3>
            <p className="font-body text-navy text-base md:text-lg leading-relaxed">
              After receiving overwhelming appreciation from Principals for last year’s Handbook &amp; Planner, we’re excited to bring them the much-awaited 2027–28 edition—created to make every school leader’s year more organised, focused and impactful.
            </p>
          </motion.div>
        )}


        {!priceConfig.prebookingOpen && configLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-10 bg-card border-2 border-gold rounded-2xl p-8 text-center shadow-xl"
          >
            <h3 className="font-display text-2xl md:text-3xl font-bold text-navy mb-3">
              All Orders Closed for This Year
            </h3>
            <p className="font-body text-foreground text-base md:text-lg">
              All orders are closed for this year. We are no longer accepting any payments for the Principal's Handbook & Planner.
            </p>
            <p className="font-body text-muted-foreground text-sm mt-3">
              Thank you for the overwhelming response from Principals across India. Please visit{" "}
              <a href="https://www.aceedx.com" target="_blank" rel="noopener noreferrer" className="text-gold font-semibold hover:underline">
                www.aceedx.com
              </a>{" "}
              for updates.
            </p>
          </motion.div>
        )}

        <div className={`max-w-4xl mx-auto grid lg:grid-cols-2 gap-10 ${!priceConfig.prebookingOpen && configLoaded ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl overflow-hidden shadow-xl border border-border"
          >
            <div className="gradient-navy p-8 text-center">
              <p className="font-body text-gold-light text-sm font-semibold tracking-wider uppercase mb-2">
                Pre-Booking Price
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="font-body text-primary-foreground/50 line-through text-2xl">
                  ₹{priceConfig.originalPrice}
                </span>
                <span className="font-display text-5xl font-bold text-gold">
                  ₹{priceConfig.salePrice}
                </span>
              </div>
              <p className="font-body text-white text-sm mt-2">
                You save ₹{priceConfig.originalPrice - priceConfig.salePrice} per copy!
              </p>
            </div>

            <div className="p-8 space-y-5">
              {[
                { icon: BookOpen, text: "130-page paperback handbook & planner" },
                { icon: ShieldCheck, text: "CBSE & NEP 2020 aligned content" },
                { icon: Truck, text: "Free shipping across India" },
                { icon: IndianRupee, text: "Secure Razorpay payment" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-pale flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-navy" />
                  </div>
                  <span className="font-body text-foreground">{text}</span>
                </div>
              ))}

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-body text-muted-foreground">Quantity: {formData.quantity}</span>
                  <span className="font-body text-sm text-gold font-semibold">Save ₹{savings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-display text-xl font-bold text-navy">Total</span>
                  <span className="font-display text-2xl font-bold text-navy">₹{totalAmount}</span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              { name: "name", label: "Full Name *", type: "text", placeholder: "Dr. Sharma" },
              { name: "email", label: "Email Address *", type: "email", placeholder: "principal@school.edu.in" },
              { name: "phone", label: "Phone Number *", type: "tel", placeholder: "+91 98765 43210" },
              { name: "school", label: "School Name", type: "text", placeholder: "Delhi Public School" },
            ].map((field) => (
              <div key={field.name}>
                <label className="font-body text-sm font-medium text-foreground block mb-1">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-card font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}

            {/* Shipping Address */}
            <div>
              <label className="font-body text-sm font-medium text-foreground block mb-1">
                Shipping Address *
              </label>
              <textarea
                name="address"
                placeholder="House/Flat No., Street, Locality"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-card font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body text-sm font-medium text-foreground block mb-1">
                  City *
                </label>
                <input
                  name="city"
                  type="text"
                  placeholder="New Delhi"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-card font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground block mb-1">
                  Pincode *
                </label>
                <input
                  name="pincode"
                  type="text"
                  placeholder="110001"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-card font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="font-body text-sm font-medium text-foreground block mb-1">
                Quantity
              </label>
              <input
                name="quantity"
                type="number"
                min={1}
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-card font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {paymentError && <p role="alert" className="font-body text-sm text-destructive">{paymentError}</p>}
            {confirmation && (
              <Button onClick={() => confirmPayment(confirmation)} disabled={loading} className="w-full">
                {loading ? "Verifying payment..." : "Retry payment confirmation"}
              </Button>
            )}
            <Button
              onClick={handlePayment}
              disabled={loading || !configLoaded || !priceConfig.prebookingOpen || Boolean(confirmation)}
              className="w-full gradient-orange text-primary-foreground font-body font-bold text-lg py-4 rounded-lg shadow-orange hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : priceConfig.prebookingOpen
                ? `Pre-Book Now — Limited Copies! — ₹${totalAmount}`
                : "Pre-Booking Closed"}
            </Button>

            <p className="font-body text-xs text-center text-muted-foreground">
              🔒 100% secure payment via Razorpay. Your data is safe with us.
            </p>
          </motion.div>
        </div>
        <div className="text-center mt-8">
          <a href="https://www.aceedx.com" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-gold font-semibold hover:underline">
            www.aceedx.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default PrebookSection;
