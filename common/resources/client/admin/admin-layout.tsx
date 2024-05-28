import {Outlet} from 'react-router-dom';
import {AdminSidebar} from './admin-sidebar';
import {DashboardLayout} from '../ui/layout/dashboard-layout';
import {DashboardContent} from '../ui/layout/dashboard-content';
import {DashboardSidenav} from '../ui/layout/dashboard-sidenav';
import {DashboardNavbar} from '../ui/layout/dashboard-navbar';
import {
  AdminSetupAlert,
  useAdminSetupAlerts,
} from '@common/admin/use-admin-setup-alerts';
import {SectionHelper} from '@common/ui/section-helper';
import {ErrorIcon} from '@common/icons/material/Error';
import {
  setInLocalStorage,
  useLocalStorage,
} from '@common/utils/hooks/local-storage';

export function AdminLayout() {
  return (
    <DashboardLayout name="admin" leftSidenavCanBeCompact>
      <DashboardNavbar size="sm" menuPosition="admin-navbar" />
      <DashboardSidenav position="left" size="sm">
        <AdminSidebar />
      </DashboardSidenav>
      <DashboardContent>
        <div className="bg dark:bg-alt">
          <SetupAlertsList />
          <Outlet />
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
}

function SetupAlertsList() {
  const {data} = useAdminSetupAlerts();
  const [dismissValue] = useLocalStorage<{
    timestamp: number;
  } | null>('admin-setup-alert-dismissed', null);

  // show alert if 1 day passed since last dismiss
  const shouldShowAlert =
    !dismissValue || Date.now() - dismissValue.timestamp > 86400000;

  if (!data?.alerts.length || !shouldShowAlert) {
    return null;
  }

  return (
    <div className="fixed left-0 right-0 top-24 z-10 mx-auto w-max overflow-hidden rounded-panel bg shadow-md">
      <SetupAlert alert={data.alerts[0]} />
    </div>
  );
}

interface SetupAlertProps {
  alert: AdminSetupAlert;
}
function SetupAlert({alert}: SetupAlertProps) {
  const description = (
    <div dangerouslySetInnerHTML={{__html: alert.description}}></div>
  );
  return (
    <SectionHelper
      leadingIcon={<ErrorIcon size="xs" className="text-danger" />}
      onClose={() => {
        setInLocalStorage('admin-setup-alert-dismissed', {
          timestamp: Date.now(),
        });
      }}
      key={alert.title}
      title={alert.title}
      description={description}
      color="neutral"
    />
  );
}
