import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, Clock3, Star } from "lucide-react";

const sidebarStats = [
  { icon: Star, label: "Engagement", value: "92%" },
  { icon: Clock3, label: "Avg. RSVP time", value: "2h 14m" },
  { icon: CheckCircle2, label: "Live capacity", value: "8,400 guests" },
];

export function Sidebar() {
  return (
    <Card className="space-y-6 bg-slate-950/5">
      <div className="flex items-center justify-between gap-3 rounded-3xl bg-gradient-to-r from-primary-500/10 via-white to-accent-500/10 px-5 py-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Smart insights</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">Your next launch roadmap</h3>
        </div>
        <Badge variant="outline">Pro</Badge>
      </div>
      <div className="space-y-4">
        {sidebarStats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white/80 p-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">{item.label}</p>
                <p className="text-base font-semibold text-slate-950">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
