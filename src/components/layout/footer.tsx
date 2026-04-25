import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold text-slate-900">Planora</p>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Plan, join, and manage events with a complete workflow — from
              invitations to payments.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Navigate
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/" className="hover:text-slate-900 hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-slate-900 hover:underline"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-slate-900 hover:underline"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-slate-900 hover:underline"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Account
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>
                <Link
                  href="/register"
                  className="hover:text-slate-900 hover:underline"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/settings"
                  className="hover:text-slate-900 hover:underline"
                >
                  Profile Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/invitations"
                  className="hover:text-slate-900 hover:underline"
                >
                  Invitations
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/reviews"
                  className="hover:text-slate-900 hover:underline"
                >
                  My Reviews
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-slate-400">
          © {currentYear} Planora. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
