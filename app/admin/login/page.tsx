import { redirect } from "next/navigation";
import { LogoMark } from "@/components/ui/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { currentAdmin, devAuthAvailable } from "@/lib/auth";
import { supabaseConfigured } from "@/lib/env";

export const metadata = { title: "Sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin");
  const configured = supabaseConfigured || devAuthAvailable();
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm border border-line bg-white p-8 shadow-card">
        <LogoMark />
        <h1 className="mt-6 text-2xl">Dashboard sign in</h1>
        <p className="mt-1 text-sm text-ink-muted">Authorised staff only.</p>
        {configured ? (
          <LoginForm devMode={!supabaseConfigured} />
        ) : (
          <p className="mt-6 text-sm text-danger">Sign-in is not configured. See README, section &ldquo;Admin access&rdquo;.</p>
        )}
      </div>
    </main>
  );
}
