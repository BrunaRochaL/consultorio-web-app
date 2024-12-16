import React, { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

import { ROUTES } from '@/utils/constants/routes'

import NotFound from '@/pages/NotFound'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Scheduling = lazy(() => import('@/pages/Scheduling'))

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Routes>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path={ROUTES.SCHEDULING} element={<Scheduling />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
