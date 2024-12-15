import React from 'react'
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
  isCollapsed: boolean
  onToggle: () => void
}

const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  baseRoute = '',
  isCollapsed,
  onToggle,
}) => {
  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
    >
      <Nav className="flex-column">
        <div className={styles.sidebarHeader}>
          <button
            className={styles.toggleBtn}
            onClick={onToggle}
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
    </aside>
  )
}

export default Sidebar
