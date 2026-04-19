import { motion } from "framer-motion";
import { CalendarDays, MapPin, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  category: string;
  capacity: string;
  venue: string;
}

export function EventCard({ title, description, date, category, capacity, venue }: EventCardProps) {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      className="min-w-[280px] rounded-[2rem] border border-white/70 bg-white/90 shadow-card backdrop-blur-xl"
    >
      <Card className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="secondary">{category}</Badge>
            <h3 className="mt-4 text-xl font-semibold text-slate-950">{title}</h3>
          </div>
          <div className="rounded-3xl bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            {capacity}
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-600">{description}</p>

        <div className="space-y-3 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary-500" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent-500" />
            <span>{venue}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Sparkles className="h-4 w-4 text-secondary-500" />
            Live access
          </div>
          <button className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
            RSVP
          </button>
        </div>
      </Card>
    </motion.article>
  );
}
