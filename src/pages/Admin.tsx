import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lock, Save, LogOut, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const getAdminError = async (error: unknown): Promise<string> => {
  const context = (error as { context?: Response } | null)?.context;
  if (context instanceof Response) {
    if (context.status === 401) return "The admin password was not accepted. Please enter your current admin password and try again.";
    try {
      const body = await context.clone().json();
      if (typeof body.error === "string") return body.error;
    } catch {
      // Fall back to a readable message if the response is not JSON.
    }
  }
  return "Unable to connect to admin settings. Please try again.";
};

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [config, setConfig] = useState({
    originalPrice: 1999,
    salePrice: 1499,
    prebookingOpen: true,
    deliveryNote: "",
    reopenNotice: "After receiving overwhelming appreciation from Principals for last year’s Handbook & Planner, we’re excited to bring them the much-awaited 2027–28 edition—created to make every school leader’s year more organised, focused and impactful.",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoginError("");
    if (!password) {
      setLoginError("Please enter your admin password.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-update-config", {
        body: { action: "verify" },
        headers: { "x-admin-password": password },
      });
      if (error) {
        setLoginError(await getAdminError(error));
        return;
      }
      if (!data?.success) {
        setLoginError(data?.error || "Admin access could not be verified. Please try again.");
        return;
      }
      setAuthenticated(true);
    } catch (error) {
      setLoginError(await getAdminError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authenticated) return;
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "price_config")
        .single();
        if (error || !data) {
          toast({ title: "Unable to load settings", description: "Please sign in again and retry.", variant: "destructive" });
          setAuthenticated(false);
          return;
        }
        setConfig((current) => ({ ...current, ...(data.value as typeof config) }));
      } catch {
        setAuthenticated(false);
        setLoginError("Unable to load admin settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [authenticated]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-update-config", {
        body: { config },
        headers: { "x-admin-password": password },
      });
      if (error) {
        toast({ title: "Settings not saved", description: await getAdminError(error), variant: "destructive" });
        return;
      }
      if (!data?.success) {
        toast({ title: "Settings not saved", description: data?.error || "Please try again.", variant: "destructive" });
        return;
      }
      toast({ title: "Saved!", description: "Pricing updated successfully. Changes are live now." });
    } catch (error) {
      toast({ title: "Settings not saved", description: await getAdminError(error), variant: "destructive" });
    } finally {
      setSaving(false);
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
              aria-label="Admin password"
              autoComplete="current-password"
              aria-invalid={Boolean(loginError)}
              aria-describedby={loginError ? "admin-login-error" : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body focus:outline-none focus:ring-2 focus:ring-gold pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </Button>
          </div>
          {loginError && <p id="admin-login-error" role="alert" className="text-sm text-destructive font-body">{loginError}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full gradient-gold text-navy font-body font-bold py-3 rounded-lg hover:scale-[1.02] transition-transform"
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
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
            setAuthenticated(false);
            setPassword("");
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
