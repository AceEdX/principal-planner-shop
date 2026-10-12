import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PRODUCT } from "@/lib/product";
import { useBooking } from "@/hooks/use-booking";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";

import previewYearly from "@/assets/preview-2027-yearly.png";
import previewActivities from "@/assets/preview-2027-activities.png";
import previewActionplan1 from "@/assets/preview-2027-actionplan1.png";
import previewActionplan2 from "@/assets/preview-2027-actionplan2.png";
import previewHolidays from "@/assets/preview-2027-holidays.png";
import previewCompliance from "@/assets/preview-compliance.png";
import previewSelfcare from "@/assets/preview-selfcare.png";
import previewPlatform from "@/assets/preview-2027-platform.png";
import previewApril from "@/assets/preview-2027-april.png";
import previewExams from "@/assets/planner-sample-121.png.asset.json";
import previewJuneHolidays from "@/assets/planner-sample-122.png.asset.json";
import previewJuneWeekly from "@/assets/planner-sample-123.png.asset.json";
import previewAugustAction from "@/assets/planner-sample-124.png.asset.json";
import previewOctoberHolidays from "@/assets/planner-sample-125.png.asset.json";
import previewReckoner from "@/assets/planner-sample-126.png.asset.json";

const previews = [
  { img: previewYearly, title: "Year at a Glance", desc: "Planning overview with monthly themes and key milestones. Source sample contains a September year typo; corrected artwork is pending." },
  { img: previewActivities, title: "Activities & Holiday Calendar", desc: "World Days, Indian Holidays, and class activities from Pre-Primary to Grade 10." },
  { img: previewActionplan1, title: "Principal's Action Plan — August", desc: "Monthly action plans with 10+ tasks, principal tips, target dates, and checkboxes." },
  { img: previewActionplan2, title: "Principal's Action Plan — September", desc: "Half-yearly exams, PTM, board registrations — every critical task mapped out." },
  { img: previewHolidays, title: "September Activities & Events", desc: "World Days, Indian Holidays, pre-primary activities, and parent engagement ideas." },
  { img: previewCompliance, title: "Inspection & Compliance Checklist", desc: "CBSE compliance checklist with status tracking, responsible persons, and verification dates." },
  { img: previewSelfcare, title: "Self-Care & Bucket List", desc: "Personal wellness trackers for physical, mental, emotional, and spiritual well-being." },
  { img: previewPlatform, title: "AceEdX Platform Guide & Calendar", desc: "Year calendar and quick-start guide to India's smartest school OS." },
  { img: previewApril, title: "April Action Plan — 18 Tasks", desc: "Detailed action plan for academic year launch with NEP alignment and diagnostics." },
  { img: previewExams.url, title: "Competitive Exams in India — 2027–28", desc: "Exam schedules, eligible grades, subject focus, and key application windows." },
  { img: previewJuneHolidays.url, title: "June 2027 — World Days & Holidays", desc: "International days, Indian festivals, class activities, and parent engagement ideas." },
  { img: previewJuneWeekly.url, title: "June 2027 — Weekly Planner", desc: "Weekly focus, priorities, and space to plan school activities and follow-ups." },
  { img: previewAugustAction.url, title: "August 2027 — Principal's Action Plan", desc: "Independence Day preparations, half-yearly planning, sports, and compliance tasks." },
  { img: previewOctoberHolidays.url, title: "October 2027 — World Days & Holidays", desc: "Festival planning, world days, and activities for every age group." },
  { img: previewReckoner.url, title: "Ready Reckoner — 2027–28", desc: "Practical checklists for events, safety drills, excursions, exams, and parent meetings." },
];

const PreviewSection = () => {
  const [active, setActive] = useState(0);
  const [enlarged, setEnlarged] = useState(false);
  const { setOverlayOpen } = useBooking();
  const changeEnlarged = (open: boolean) => { setEnlarged(open); setOverlayOpen(open); };
  const next = () => setActive((a) => (a + 1) % previews.length);
  const prev = () => setActive((a) => (a - 1 + previews.length) % previews.length);
  return <section id="preview" className="py-16 lg:py-20 bg-background border-y border-border">
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <p className="text-sm text-muted-foreground uppercase font-semibold mb-3">Selected sample pages</p>
        <h2 className="font-display text-3xl md:text-4xl text-foreground">What's Inside the Planner</h2>
        <p className="text-muted-foreground mt-4">130 pages of planning and leadership guidance. Covers {PRODUCT.coverage}.</p>
      </div>
      <div className="max-w-3xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-3">
          <Button variant="ghost" onClick={() => changeEnlarged(true)} aria-label="Enlarge sample page" className="h-auto w-full p-0 overflow-hidden hover:bg-transparent">
            <img src={previews[active].img} alt={previews[active].title} className="sample-blur w-full h-[240px] sm:h-[340px] object-cover object-top" />
          </Button>
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-border mt-3">
            <Button variant="secondary" size="icon" onClick={prev} aria-label="Previous sample"><ChevronLeft /></Button>
            <p className="text-xs text-muted-foreground flex items-center gap-2"><Lock className="w-4 h-4 shrink-0" />Pre-book to get the full planner</p>
            <Button variant="secondary" size="icon" onClick={next} aria-label="Next sample"><ChevronRight /></Button>
          </div>
        </div>
        <div className="text-center mt-5">
          <h3 className="font-display text-2xl text-foreground">{previews[active].title}</h3>
          <p className="text-muted-foreground mt-2">{previews[active].desc}</p>
          <p className="text-xs text-muted-foreground mt-2">{active + 1} / {previews.length} pages shown</p>
        </div>
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          {previews.map((p, i) => <Button key={i} variant="ghost" onClick={() => setActive(i)} aria-label={`Show ${p.title}`} aria-pressed={i === active} className={`w-14 h-11 p-0 overflow-hidden border-2 ${i === active ? "border-gold" : "border-border"}`}><img src={p.img} alt="" className="sample-blur w-full h-full object-cover object-top" /></Button>)}
        </div>
        <p className="text-sm text-muted-foreground border-l-2 border-gold pl-4 mt-6 leading-relaxed">{PRODUCT.compliance}</p>
        <p className="text-xs font-medium text-foreground mt-3">Provisional — verify against the latest CBSE circular.</p>
      </div>
    </div>
    <Dialog open={enlarged} onOpenChange={changeEnlarged}><DialogContent className="w-[calc(100%-2rem)] max-w-3xl max-h-[90dvh] overflow-y-auto rounded-lg">
      <DialogTitle className="pr-7 leading-normal">{previews[active].title}</DialogTitle>
      <DialogDescription>Selected sample · Details remain obscured</DialogDescription>
      <img src={previews[active].img} alt={previews[active].title} className="sample-enlarged w-full max-h-[65dvh] object-contain" />
      <div className="flex justify-between"><Button variant="outline" onClick={prev} aria-label="Previous enlarged sample"><ChevronLeft />Previous</Button><Button variant="outline" onClick={next} aria-label="Next enlarged sample">Next<ChevronRight /></Button></div>
    </DialogContent></Dialog>
  </section>;
};
export default PreviewSection;
