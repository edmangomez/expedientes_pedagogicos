import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { requireAuth } from "@/lib/auth";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();

  return (
    <div className="min-h-dvh bg-[#fbfaf7] text-stone-950">
      <MobileNav user={user} />
      <div className="lg:flex">
        <Sidebar user={user} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
