import React from 'react';
import { Navbar, Nav, Button, ButtonGroup } from 'rsuite';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: '홈', path: '/' },
    { name: 'GitHub', path: '/github' },
    { name: '블로그', path: '/blog' },
    { name: '유튜브', path: '/youtube' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <Navbar 
      className="navbar-custom"
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <Navbar.Brand 
        className="navbar-brand"
        style={{ 
          color: 'white', 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          padding: '0 20px'
        }}
      >
        PyNote
      </Navbar.Brand>
      
      <Nav>
        {navItems.map((item) => (
          <Nav.Item
            key={item.path}
            active={isActive(item.path)}
            onClick={() => navigate(item.path)}
            style={{
              color: isActive(item.path) ? '#667eea' : 'white',
              fontWeight: isActive(item.path) ? 'bold' : 'normal',
              transition: 'all 0.3s ease'
            }}
          >
            {item.name}
          </Nav.Item>
        ))}
      </Nav>
      
      <Nav pullRight>
        <ButtonGroup>
          <Button 
            appearance="ghost" 
            style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            onClick={() => window.open('https://github.com/jaehakl', '_blank')}
          >
            GitHub
          </Button>
          <Button 
            appearance="ghost" 
            style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            onClick={() => window.open('https://identicalparticle.com', '_blank')}
          >
            블로그
          </Button>
        </ButtonGroup>
      </Nav>
    </Navbar>
  );
};

export default NavbarComponent;
