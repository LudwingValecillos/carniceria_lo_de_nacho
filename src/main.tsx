import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { Login } from './pages/Login';
import { AdminProducts } from './pages/AdminProducts';
import { ProductProvider } from './context/ProductContext'; // Add this import
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProductProvider>
        <App />
      </ProductProvider>
    ),
    children: [
      {
        path: 'admin/productos',
        element: <AdminProducts />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);