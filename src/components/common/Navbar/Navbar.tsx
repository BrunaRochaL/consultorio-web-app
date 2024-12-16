import React, { useState } from 'react'
import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap'

import styles from './Navbar.module.css'

import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { logout } from '../../../features/auth/authSlice'
import useFormatTime from '../../../hooks/useFormatTime'

interface NavbarProps {
  userName?: string
  userAvatarUrl?: string
  menuItems?: Array<{
    label: string
    href: string
    onClick?: () => void
  }>
}

const Navbar: React.FC<NavbarProps> = ({
  userName = 'João da Silva',
  userAvatarUrl = '/images/default-avatar.png',
  menuItems = [],
}) => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const time = useFormatTime()
  const user = useAppSelector((state) => state.auth?.user)

  const handleToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded)
  }

  const handleLogout = () => {
    dispatch(logout())
    window.location.href = 'https://www.linkedin.com/in/brunarochal/'
  }
  return (
    <BootstrapNavbar
      bg="light"
      variant="light"
      expand="lg"
      fixed="top"
      expanded={expanded}
      onToggle={handleToggle}
      className={styles.navbarCustom}
    >
      <Container
        fluid
        className="d-flex justify-content-between align-items-center"
      >
        <div className="d-flex w-100 justify-content-between px-3">
          <div className="d-flex">
            <BootstrapNavbar.Toggle
              className="me-3"
              aria-controls="basic-navbar-nav"
            />
            <div
              className={`d-flex flex-column justify-content-center ${styles.navbarPresentation}`}
            >
              <div className="fw-bold">Olá, {user?.name || userName}</div>
              <div className="text-muted small">
                {'Acesso em Hospital Governador Celso Ramos'} - Horário atual do
                seu navegador: {time}
              </div>
            </div>
          </div>

          <div className="d-flex flex-column align-items-center">
            <div
              className={`rounded-circle bg-secondary ${styles.navbarProfile} px-3`}
              style={{
                backgroundImage: `url("${userAvatarUrl}")`,
              }}
            />
            <div className={styles.logoutContainer}>
              <button
                className={styles.logoutButton}
                onClick={handleLogout}
                aria-label="Deslogar"
              >
                Sair
              </button>
            </div>
          </div>
        </div>

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <div className="d-lg-none">
            <Nav className="flex-column">
              {menuItems.map((item, index) => (
                <Nav.Link key={index} href={item.href} onClick={item.onClick}>
                  {item.label}
                </Nav.Link>
              ))}
              <Nav.Link onClick={handleLogout}>Sair</Nav.Link>
            </Nav>
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar
