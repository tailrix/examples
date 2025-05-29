import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import UserManagementTable from "@/components/user-management"

export const dynamic = "force-dynamic"
export const revalidate = 0


interface PageProps {
  searchParams: Promise<{ tab?: string | string[] }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const currentTab = Array.isArray(tab)
    ? tab[0]
    : tab ?? "users";

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <UserManagementTable tab={currentTab} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
