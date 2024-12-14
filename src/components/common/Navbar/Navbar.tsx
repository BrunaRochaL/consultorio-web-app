import { Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap';
import React, { useState } from 'react';
import styles from './Navbar.module.css';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import useFormatTime from '../../../hooks/useFormatTime';
import { logout } from '../../../features/auth/authSlice';

interface NavbarProps {
  userName?: string;
  userAvatarUrl?: string;
  menuItems?: Array<{
    label: string;
    href: string;
    onClick?: () => void;
  }>;
}

const Navbar: React.FC<NavbarProps> = ({
  userName = 'João da Silva',
  userAvatarUrl = '...',
  menuItems = [],
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const time = useFormatTime();
  const user = useAppSelector((state) => state.auth?.user);

  const handleToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const handleLogout = () => {
    dispatch(logout());
  };
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
        <div className="d-flex w-100 justify-content-between">
          <div className="d-flex align-items-center">
            <BootstrapNavbar.Toggle
              className="me-3"
              aria-controls="basic-navbar-nav"
            />
            <div>
              <div className="fw-bold">{user?.name || userName}</div>
              <div className="text-muted small">{time}</div>
            </div>
          </div>

          <div
            className={`rounded-circle bg-secondary ${styles.navbarProfile}`}
            style={{
              backgroundImage: `url("${userAvatarUrl}")`,
            }}
          />
        </div>

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <div className="d-lg-none">
            <Nav className="flex-column">
              {menuItems.map((item, index) => (
                <Nav.Link key={index} href={item.href} onClick={item.onClick}>
                  {item.label}
                </Nav.Link>
              ))}
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
