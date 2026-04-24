"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard/my-events", label: "My Events" },
  { href: "/dashboard/invitations", label: "Invitations" },
  { href: "/dashboard/reviews", label: "Reviews" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="space-y-2 rounded border bg-white p-3">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`block rounded px-3 py-2 ${
            pathname === link.href ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
}
