import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { NavigationProvider } from '../context/NavigationContext';
import LoadingWrapper from '../components/LoadingWrapper';
import Sidebar from '../layout/Sidebar';
import routeItems from './routeItems.ts';
import { Box } from '@mui/material';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <NavigationProvider>
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f0f2f5' }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
            <Suspense fallback={<LoadingWrapper />}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                {Object.values(routeItems).flat().map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}
              </Routes>
            </Suspense>
          </Box>
        </Box>
      </NavigationProvider>
    </BrowserRouter>
  );
}