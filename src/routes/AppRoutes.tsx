import React, { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { ROUTES } from '@/utils/constants/routes'

import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Pacientes = lazy(() => import('@/pages/Pacientes'))
const Consultas = lazy(() => import('@/pages/Consultas'))
const Relatorios = lazy(() => import('@/pages/Relatorios'))
const Configuracoes = lazy(() => import('@/pages/Configuracoes'))

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.HOME} replace />} />
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.PACIENTES} element={<Pacientes />} />
        <Route path={ROUTES.CONSULTAS} element={<Consultas />} />
        <Route path={ROUTES.RELATORIOS} element={<Relatorios />} />
        <Route path={ROUTES.CONFIGURACOES} element={<Configuracoes />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
