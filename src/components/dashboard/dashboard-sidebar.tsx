"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Inbox, MessageSquare, Settings } from "lucide-react";

const links = [
  { href: "/dashboard/my-events", label: "My Events", icon: CalendarDays },
  { href: "/dashboard/invitations", label: "Invitations", icon: Inbox },
  { href: "/dashboard/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="space-y-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
            pathname === link.href
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
    </aside>
  );
}
