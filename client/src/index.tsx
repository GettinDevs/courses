import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import './index.css';
import { App } from './pages/App';
import { Dashboard } from './pages/Dashboard';
import { UserProvider } from './contexts/UserContext';
import { LocationProvider } from './contexts/LocationContext';

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
    errorElement: <div>404</div>,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <div>404</div>
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <LocationProvider>
          <RouterProvider router={router} />
        </LocationProvider>
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
