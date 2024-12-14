import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface NavLinkItemProps {
  path: string;
  icon: string;
  label: string;
  baseRoute?: string;
  isCollapsed: boolean;
}

const NavLinkItem: React.FC<NavLinkItemProps> = ({
  path,
  icon,
  label,
  baseRoute = '',
  isCollapsed,
}) => {
  const location = useLocation();
  const fullPath = `${baseRoute}${path}`;
  const isActive = location.pathname === fullPath;

  return (
    <Nav.Link
      as={Link}
      to={fullPath}
      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''} ${
        isCollapsed ? styles.collapsedNavLink : ''
      }`}
    >
      <i className={`bi ${icon} ${styles.icon}`}></i>
      <span
        className={`${styles.menuLabel} ${
          isCollapsed ? styles.collapsedMenuLabel : ''
        }`}
      >
        {label}
      </span>
    </Nav.Link>
  );
};

export default NavLinkItem;
