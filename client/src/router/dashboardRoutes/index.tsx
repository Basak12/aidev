import { lazy } from 'react';

const DashboardPage = lazy(() => import('../../content/Pages/Dashboard'));

const dashboardRoutes = [{ path: '/dashboard', element: <DashboardPage /> }];

export default dashboardRoutes;
