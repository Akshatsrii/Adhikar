import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter, createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './routes/__root'
import { Route as indexRoute } from './routes/index'
import { Route as loginRoute } from './routes/login'
import { Route as registerRoute } from './routes/register'
import { Route as dashboardRoute } from './routes/dashboard'
import './index.css'

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  dashboardRoute,
])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
