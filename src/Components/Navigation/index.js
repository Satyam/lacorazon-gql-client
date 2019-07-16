import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavLink,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import laCorazon from '../../La Corazon.png';

import { useAuth } from 'Components/auth/context';

import styles from './styles.module.css';

export function Navigation() {
  const [isOpen, setOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  function toggle() {
    setOpen(!isOpen);
  }
  return (
    <div>
      <Navbar expand="md" light className={styles.navbar}>
        <NavbarBrand href="/" className={styles.navbrand}>
          <img src={laCorazon} alt="La Corazón" />
          La Corazón
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/users">
                Usuarios
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/distribuidores">
                Distribuidores
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/ventas">
                Ventas
              </NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret className={styles.user}>
                {currentUser ? currentUser.nombre : 'guest'}
              </DropdownToggle>
              <DropdownMenu right>
                {currentUser ? (
                  <DropdownItem onClick={logout}>Logout</DropdownItem>
                ) : (
                  <DropdownItem tag={Link} to="/login">
                    Login
                  </DropdownItem>
                )}
                <DropdownItem divider />
                <DropdownItem tag={Link} to="/login/register">
                  Register
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}
