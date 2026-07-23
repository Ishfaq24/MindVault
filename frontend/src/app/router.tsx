import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Spinner } from '../components/Spinner';

const LandingPage = lazy(() => import('../pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('../pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const UploadPage = lazy(() => import('../pages/UploadPage').then(m => ({ default: m.UploadPage })));
const FilesPage = lazy(() => import('../pages/FilesPage').then(m => ({ default: m.FilesPage })));
const FileDetailsPage = lazy(() => import('../pages/FileDetailsPage').then(m => ({ default: m.FileDetailsPage })));
const SearchPage = lazy(() => import('../pages/SearchPage').then(m => ({ default: m.SearchPage })));
const ChatPage = lazy(() => import('../pages/ChatPage').then(m => ({ default: m.ChatPage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const UnauthorizedPage = lazy(() => import('../pages/UnauthorizedPage').then(m => ({ default: m.UnauthorizedPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<PageLoader />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: '/unauthorized',
    element: (
      <Suspense fallback={<PageLoader />}>
        <UnauthorizedPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'upload',
        element: (
          <Suspense fallback={<PageLoader />}>
            <UploadPage />
          </Suspense>
        ),
      },
      {
        path: 'files',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FilesPage />
          </Suspense>
        ),
      },
      {
        path: 'files/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FileDetailsPage />
          </Suspense>
        ),
      },
      {
        path: 'search',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SearchPage />
          </Suspense>
        ),
      },
      {
        path: 'chat',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ChatPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);
