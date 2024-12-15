import React, { useState } from 'react'
import { Nav } from 'react-bootstrap'

import NavLinkItem from './NavLinkItem'
import styles from './Sidebar.module.css'

interface MenuItem {
  path: string
  icon: string
  label: string
}

interface SidebarProps {
  menuItems: MenuItem[]
  baseRoute?: string
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, baseRoute = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true)

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev)
  }

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <Nav className="flex-column">
        <div className={styles.sidebarHeader}>
          <button
            className={styles.toggleBtn}
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <i
              className={`bi ${
                isCollapsed
                  ? 'bi-chevron-double-right'
                  : 'bi-chevron-double-left'
              }`}
            ></i>
          </button>
        </div>
        {menuItems.map((item) => (
          <NavLinkItem
            key={item.path}
            path={item.path}
            icon={item.icon}
            label={item.label}
            baseRoute={baseRoute}
            isCollapsed={isCollapsed}
          />
        ))}
      </Nav>
    </div>
  )
}

export default Sidebar
