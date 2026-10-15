import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PRODUCT } from "@/lib/product";

const questions = [
  ["What period does the handbook cover?", "The Principal’s Handbook & Planner 2027–28 covers April 2027 to April 2028, inclusive—a 13-month planning period."],
  ["Is this a physical book?", "Yes. This is a printed, hardbound handbook and planner with an attractive leather cover and gold embossing."],
  ["What is the pre-booking price?", "The pre-booking price is ₹1,499 per copy, with free shipping across India."],
  ["When will I receive my copy?", "Delivery will be in January 2027. This is a pre-booking, so the book will not be delivered immediately after payment."],
  ["How will this handbook help me?", "It brings monthly action plans, weekly planning pages, activity calendars, inspection checklists, leadership guidance, and reflection sections together to help you organise your school leadership responsibilities."],
  ["Can I preview the handbook before ordering?", <>Yes. Use the <a href="#preview" className="text-primary underline underline-offset-4">Preview Sample Pages</a> button to explore selected pages before pre-booking.</>],
  ["Are all CBSE dates final?", "Some 2027–28 dates are provisional planning references. Always check the latest official CBSE circulars before acting on a date or deadline."],
  ["Can I order more than one copy?", <>Yes. Select your quantity in the order form. For assistance with a larger order, <a href={PRODUCT.telephone} className="text-primary underline underline-offset-4">call +91 9373387800</a>.</>],
  ["Who can I contact for help?", <><a href={PRODUCT.telephone} className="text-primary underline underline-offset-4">Call +91 9373387800</a> for product or pre-booking assistance.</>],
];

export default function FAQSection() {
  return <section id="faq" className="bg-card py-16 lg:py-20 border-y border-border">
    <div className="max-w-3xl mx-auto px-4">
      <p className="text-muted-foreground text-sm font-semibold uppercase mb-3">Before you pre-book</p>
      <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible>{questions.map(([question, answer], index) => <AccordionItem key={index} value={`question-${index}`}>
        <AccordionTrigger className="text-left text-base gap-4 focus-visible:ring-2 focus-visible:ring-ring">{question}</AccordionTrigger>
        <AccordionContent className="text-muted-foreground text-base leading-relaxed pr-6">{answer}</AccordionContent>
      </AccordionItem>)}</Accordion>
      <a href={PRODUCT.telephone} className="block mt-8 text-primary font-medium underline underline-offset-4">{PRODUCT.support}</a>
    </div>
  </section>;
}