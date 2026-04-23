import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lock, Save, LogOut, Eye, EyeOff } from "lucide-react";

const ADMIN_PASSWORD = "aceedx2026"; // Change this to your desired admin password

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [config, setConfig] = useState({
    originalPrice: 1999,
    salePrice: 1499,
    prebookingOpen: true,
    deliveryNote: "Expected dispatch before June 2026 — depends on the day you order",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
    } else {
      toast({ title: "Wrong password", description: "Please try again.", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    const fetchConfig = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "price_config")
        .single();
      if (data && !error) {
        setConfig(data.value as typeof config);
      }
      setLoading(false);
    };
    fetchConfig();
  }, [authenticated]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_config" as any)
      .update({ value: config, updated_at: new Date().toISOString() } as any)
      .eq("key", "price_config");
    setSaving(false);
    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved!", description: "Pricing updated successfully. Changes are live now." });
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-card rounded-2xl p-8 shadow-xl max-w-sm w-full space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-navy" />
            </div>
            <h1 className="font-display text-2xl font-bold text-navy">Admin Access</h1>
            <p className="font-body text-muted-foreground text-sm mt-1">Enter your admin password</p>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body focus:outline-none focus:ring-2 focus:ring-gold pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full gradient-gold text-navy font-body font-bold py-3 rounded-lg hover:scale-[1.02] transition-transform"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-body text-muted-foreground">Loading config...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="gradient-navy py-4 px-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-gold">AceEdX Admin Panel</h1>
        <button
          onClick={() => {
            sessionStorage.removeItem("admin_auth");
            setAuthenticated(false);
          }}
          className="flex items-center gap-2 text-gold-light font-body text-sm hover:text-gold transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-lg">
        <div className="bg-card rounded-2xl p-8 shadow-xl border border-border space-y-6">
          <h2 className="font-display text-2xl font-bold text-navy">Pricing Configuration</h2>
          <p className="font-body text-muted-foreground text-sm">Changes go live immediately on the landing page.</p>

          <div className="space-y-4">
            <div>
              <label className="font-body text-sm font-medium text-foreground block mb-1">
                Original Price (MRP) — ₹
              </label>
              <input
                type="number"
                value={config.originalPrice}
                onChange={(e) => setConfig({ ...config, originalPrice: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background font-body focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="font-body text-sm font-medium text-foreground block mb-1">
                Sale Price — ₹
              </label>
              <input
                type="number"
                value={config.salePrice}
                onChange={(e) => setConfig({ ...config, salePrice: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background font-body focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="font-body text-sm font-medium text-foreground block mb-1">
                Delivery Note
              </label>
              <input
                type="text"
                value={config.deliveryNote}
                onChange={(e) => setConfig({ ...config, deliveryNote: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background font-body focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-gold-pale">
              <span className="font-body font-medium text-navy">Pre-Booking Open</span>
              <button
                onClick={() => setConfig({ ...config, prebookingOpen: !config.prebookingOpen })}
                className={`w-14 h-7 rounded-full transition-colors relative ${
                  config.prebookingOpen ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                    config.prebookingOpen ? "translate-x-7" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex justify-between items-center mb-4 text-sm font-body text-muted-foreground">
              <span>Savings per copy:</span>
              <span className="font-semibold text-navy">₹{config.originalPrice - config.salePrice}</span>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full gradient-gold text-navy font-body font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save & Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
