import Link from "next/link";
import { logoutAction } from "@/app/actions/admin";
import { LogoMark } from "@/components/ui/Logo";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth";
import { getStore } from "@/lib/store";

export const metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const store = getStore();
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/admin" className="flex items-center gap-3 no-underline">
            <LogoMark className="h-8 w-8" />
            <span className="font-serif text-lg text-navy">Dashboard</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-ink-muted sm:inline">{admin.email} · {admin.role}{admin.mode === "dev" && " · dev mode"}</span>
            <span className="rounded-sm border border-line px-2 py-0.5 text-xs text-ink-muted">store: {store.kind}</span>
            <Link href="/" className="text-ink-muted">View site</Link>
            <form action={logoutAction}><button type="submit" className="font-semibold text-navy underline">Sign out</button></form>
          </div>
        </div>
        <AdminNav />
      </header>
      <main id="main" className="mx-auto max-w-7xl px-4 py-8 md:px-6">{children}</main>
    </div>
  );
}
