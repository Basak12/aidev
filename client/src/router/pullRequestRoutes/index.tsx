import { lazy } from 'react';

const PullRequestsPage = lazy(() => import('../../content/Pages/PullRequests'));

const pullRequestRoutes = [{ path: '/pull-requests', element: <PullRequestsPage /> }];

export default pullRequestRoutes;
