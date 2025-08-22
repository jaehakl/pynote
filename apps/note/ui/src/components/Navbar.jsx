import React from 'react';
import { Navbar, Nav, Button, ButtonGroup } from 'rsuite';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: '홈', path: '/' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <Navbar className="navbar-custom">
      <Navbar.Brand className="navbar-brand">
        PyNote
      </Navbar.Brand>          
      <div className="navbar-right">
        <ButtonGroup>
          <Button 
            appearance="ghost" 
            className="nav-button-ghost"
            onClick={() => window.open('https://github.com/jaehakl', '_blank')}
          >
            GitHub
          </Button>
          <Button 
            appearance="ghost" 
            className="nav-button-ghost"
            onClick={() => window.open('https://identicalparticle.com', '_blank')}
          >
            블로그
          </Button>
        </ButtonGroup>
      </div>
    </Navbar>
  );
};

export default NavbarComponent;
