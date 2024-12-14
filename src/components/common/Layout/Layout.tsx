import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import React from 'react'
import { Container } from 'react-bootstrap'

import { useAppSelector } from '@/app/hooks'

import styles from './Layout.module.css'
import { ROUTES } from '@/utils/constants/routes'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const user = useAppSelector((state) => state.auth.user)

  const sidebarMenuItems = [
    { path: ROUTES.DASHBOARD, icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: ROUTES.PACIENTES, icon: 'bi-people', label: 'Pacientes' },
    { path: ROUTES.CONSULTAS, icon: 'bi-calendar', label: 'Consultas' },
    { path: ROUTES.RELATORIOS, icon: 'bi-file-text', label: 'Relatórios' },
    { path: ROUTES.CONFIGURACOES, icon: 'bi-gear', label: 'Configurações' },
  ]

  const navbarMenuItems = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Dashboard', href: ROUTES.DASHBOARD },
    { label: 'Settings', href: ROUTES.CONFIGURACOES },
    { label: 'Profile', href: ROUTES.PACIENTES },
  ]

  return (
    <div className={styles.layout}>
      <Navbar
        userName={user?.name}
        userAvatarUrl={user?.avatarUrl || '/api/placeholder/40/40'}
        menuItems={navbarMenuItems}
      />
      <Sidebar menuItems={sidebarMenuItems} baseRoute="" />
      <main className={styles.content}>
        <Container fluid className="p-4">
          {children}
        </Container>
      </main>
    </div>
  )
}

export default Layout
