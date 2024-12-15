import React, { useState } from 'react'
import { Container } from 'react-bootstrap'

import { useAppSelector } from '@/app/hooks'

import { ROUTES } from '@/utils/constants/routes'

import styles from './Layout.module.css'

import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const user = useAppSelector((state) => state.auth.user)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  return (
    <div className={styles.layout}>
      <Navbar
        userName={user?.name}
        userAvatarUrl={user?.avatarUrl}
        menuItems={navbarMenuItems}
      />
      <div className={styles.mainContent}>
        <Sidebar
          menuItems={sidebarMenuItems}
          baseRoute=""
          isCollapsed={isSidebarCollapsed}
          onToggle={handleSidebarToggle}
        />
        <main
          className={`${styles.content} ${
            isSidebarCollapsed ? styles.contentWithCollapsedSidebar : ''
          }`}
        >
          <Container fluid>{children}</Container>
        </main>
      </div>
    </div>
  )
}

export default Layout
