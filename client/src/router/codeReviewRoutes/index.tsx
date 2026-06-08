import { lazy } from 'react';

const CodeReviewPage = lazy(() => import('../../content/Pages/CodeReview'));

const codeReviewRoutes = [{ path: '/code-review', element: <CodeReviewPage /> }];

export default codeReviewRoutes;
