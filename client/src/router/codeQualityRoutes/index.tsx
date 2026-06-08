import { lazy } from 'react';

const CodeQualityPage = lazy(() => import('../../content/Pages/CodeQuality'));

const codeQualityRoutes = [{ path: '/code-quality', element: <CodeQualityPage /> }];

export default codeQualityRoutes;
