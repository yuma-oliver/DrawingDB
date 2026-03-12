import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../../shared/layouts/AppLayout';
import SearchPage from '../../pages/SearchPage';
import UploadPage from '../../pages/UploadPage';
import DrawingDetailPage from '../../pages/DrawingDetailPage';
import ManagePage from '../../pages/ManagePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout><SearchPage /></AppLayout>,
  },
  {
    path: '/search',
    element: <Navigate to="/" replace />,
  },
  {
    path: '/upload',
    element: <AppLayout><UploadPage /></AppLayout>,
  },
  {
    path: '/drawings/:id',
    element: <AppLayout><DrawingDetailPage /></AppLayout>,
  },
  {
    path: '/manage',
    element: <AppLayout><ManagePage /></AppLayout>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);
