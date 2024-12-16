import React, { useState } from 'react'
import { Container } from 'react-bootstrap'

import { ROUTES } from '@/utils/constants/routes'

import styles from './Layout.module.css'
import { useGetAuthQuery } from '@/services/api'

import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: authData } = useGetAuthQuery()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)

  const sidebarMenuItems = [
    {
      path: ROUTES.DASHBOARD,
      icon: 'bi-speedometer2',
      label: 'Área de Trabalho',
    },
    {
      path: ROUTES.SCHEDULING,
      icon: 'bi-calendar-plus',
      label: 'Agendar Consulta',
    },
    { path: ROUTES.APPOINTMENTS, icon: 'bi-calendar', label: 'Consultas' },
  ]

  const navbarMenuItems = [
    { label: 'Área de Trabalho', href: ROUTES.DASHBOARD },
    { label: 'Agendar', href: ROUTES.SCHEDULING },
    { label: 'Consultas', href: ROUTES.APPOINTMENTS },
  ]

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  if (!authData) {
    return null
  }

  return (
    <div className={styles.layout}>
      <Navbar
        userName={authData.user?.name}
        userAvatarUrl={authData.user?.avatarUrl}
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
