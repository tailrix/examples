import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Copyright from '../components/Copyright';
import SidebarFooterAccount, { ToolbarAccountOverride } from './SidebarFooterAccount';
import CandlestickChartOutlinedIcon from '@mui/icons-material/CandlestickChartOutlined';


export default function Layout(props: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      slots={{
        toolbarAccount: ToolbarAccountOverride,
        sidebarFooter: SidebarFooterAccount,
      }}
      branding={{
        logo: <CandlestickChartOutlinedIcon />,
        title: 'Stock tracker',
        homeUrl: '/',
      }}
    >
      <PageContainer>
        {props.children}
        <Copyright sx={{ my: 4 }} />
      </PageContainer>
    </DashboardLayout>
  );
}
