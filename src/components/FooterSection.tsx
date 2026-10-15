import aceedxLogo from "@/assets/aceedx-logo.png";
import { PRODUCT } from "@/lib/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Policy = {
  label: string;
  title: string;
  body: string[];
};

const POLICIES: Policy[] = [
  {
    label: "Terms & Conditions",
    title: "Terms & Conditions",
    body: [
      `By placing a pre-booking for the ${PRODUCT.title} on this website, you agree to these terms.`,
      `Product: ${PRODUCT.format} Coverage: ${PRODUCT.coverage}.`,
      "Prices shown on this page are in Indian Rupees (INR) and are inclusive of all applicable taxes. The price charged is the price displayed at the time of your order.",
      "This is a pre-booking offer. Your payment reserves your copy of the 2027–28 edition ahead of printing.",
      "Orders are confirmed only after successful payment through our payment partner, Razorpay. We do not store your card, UPI, or banking details.",
      "AceEdX reserves the right to decline or cancel any order in case of pricing errors, stock unavailability, or suspected fraud. In such cases, any amount paid will be refunded in full.",
      "All content, design, and material in the Handbook & Planner and on this website are the intellectual property of AceEdX and may not be reproduced without written permission.",
      "These terms are governed by the laws of India. Any disputes are subject to the jurisdiction of courts in India.",
    ],
  },
  {
    label: "Refund & Cancellation",
    title: "Refund & Cancellation Policy",
    body: [
      "You may cancel your pre-booking within 48 hours of placing the order for a full refund, provided the book has not been dispatched.",
      "Once the book has been dispatched, cancellations are not accepted.",
      "If you receive a damaged or defective copy, contact us within 7 days of delivery with photographs, and we will replace the copy or issue a full refund at no extra cost.",
      "Approved refunds are processed to the original payment method within 5–7 business days through Razorpay.",
      "To request a cancellation or refund, call or WhatsApp us at +91 9373387800 or email helpdesk@aceedx.com with your order ID and payment ID.",
    ],
  },
  {
    label: "Shipping Policy",
    title: "Shipping Policy",
    body: [
      PRODUCT.delivery,
      "Free shipping across India is included in the pre-booking price — no additional delivery charges.",
      "Each order is dispatched to the shipping address provided at the time of booking. Please ensure your address, city, and pincode are accurate.",
      "Dispatch timelines depend on the date of your order and the printing schedule. You will be informed once your copy is dispatched.",
      "For any delivery-related queries, contact us at +91 9373387800 or helpdesk@aceedx.com.",
    ],
  },
  {
    label: "Privacy Policy",
    title: "Privacy Policy",
    body: [
      "We collect only the information needed to fulfil your order: your name, school name, email, phone number, and shipping address.",
      "Your details are used solely to process your pre-booking, deliver your Handbook & Planner, and communicate order updates.",
      "Payment information is processed securely by Razorpay. We never see or store your card, UPI, or banking credentials.",
      "We do not sell, rent, or share your personal information with third parties except as required to deliver your order (e.g., courier partners) or by law.",
      "You may request access to or deletion of your personal data by contacting helpdesk@aceedx.com.",
    ],
  },
  {
    label: "Contact Us",
    title: "Contact Us",
    body: [
      "AceEdX — Powering Education Ecosystems",
      "Phone / WhatsApp: +91 9373387800",
      "Email: helpdesk@aceedx.com",
      "Website: www.aceedx.com",
      "For order support, please keep your order ID and payment ID handy so we can help you faster.",
    ],
  },
];

const FooterSection = () => (
  <footer className="gradient-navy py-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={aceedxLogo} alt="AceEdX Logo" className="w-12 h-12 rounded-lg" />
          <div>
            <p className="font-display text-lg font-bold text-primary-foreground">AceEdX</p>
            <p className="font-body text-xs text-gold-light">Powering Education Systems</p>
          </div>
        </div>

        <p className="font-body text-sm text-primary-foreground/60 text-center">
          A Planner. A Guide. A Partner in Your Leadership Journey. ⭐
        </p>

        <p className="font-body text-xs text-primary-foreground/40">
          © 2026 AceEdX. All rights reserved.
        </p>
      </div>

      <nav
        aria-label="Policies"
        className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-primary-foreground/10 pt-6"
      >
        {POLICIES.map((policy) => (
          <Dialog key={policy.label}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="font-body text-xs text-primary-foreground/60 underline-offset-4 transition-colors hover:text-gold-light hover:underline"
              >
                {policy.label}
              </button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-display">{policy.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                {policy.body.map((paragraph, index) => (
                  <p key={index} className="font-body text-sm text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </nav>
    </div>
  </footer>
);

export default FooterSection;
