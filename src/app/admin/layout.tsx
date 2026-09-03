import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-lg font-black text-navy">
            TPointic Admin
          </Link>
          <nav className="flex items-center gap-6 text-sm font-bold text-slate">
            <Link href="/admin" className="hover:text-coral">
              Dashboard
            </Link>
            <Link href="/admin/turmas" className="hover:text-coral">
              Turmas
            </Link>
            <Link href="/admin/cases" className="hover:text-coral">
              Cases
            </Link>
            <form action={signOut}>
              <button type="submit" className="hover:text-coral">
                Sair
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
