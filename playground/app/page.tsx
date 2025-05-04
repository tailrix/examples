import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TailrixProvider } from "tailrix/client/tailrixprovider"

import OverviewTable from "@/components/overview-table"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Page(
  props: {
    searchParams: Promise<{ accountId?: string; orgId?: string; isCustomerId?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const accountId = searchParams.accountId ?? "";
  const orgId = searchParams.orgId ?? "";
  const isCustomerId = searchParams.isCustomerId === "true";
  return (
    <SidebarProvider>
      <TailrixProvider endPointURL="/api/features" cacheMaxAge={5000} >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <OverviewTable accountId={accountId} orgId={orgId} isCustomerId={isCustomerId} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </TailrixProvider>
    </SidebarProvider>
  )
}
