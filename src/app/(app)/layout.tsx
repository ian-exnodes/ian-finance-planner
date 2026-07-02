import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { SidebarNav } from "@/components/shared/sidebar-nav";
import { Topbar } from "@/components/shared/topbar";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards these routes; this is defense in depth.
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center border-b px-6">
          <span className="text-sm font-semibold">Quản lý Tài chính</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <SidebarNav />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar email={user.email ?? ""} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
