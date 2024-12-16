import React, { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

import { ROUTES } from '@/utils/constants/routes'

import NotFound from '@/pages/NotFound'

const Dashboard = lazy(() => import('@/pages/Dashboard/Dashboard'))
const Scheduling = lazy(() => import('@/pages/Scheduling/Scheduling'))
const Appointments = lazy(() => import('@/pages/Appointments/Appointments'))

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Routes>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path={ROUTES.SCHEDULING} element={<Scheduling />} />
        <Route path={ROUTES.APPOINTMENTS} element={<Appointments />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
