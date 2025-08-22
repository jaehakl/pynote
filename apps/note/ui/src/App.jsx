import React, { useState, useEffect } from 'react';
import { Container, Content, Sidebar, Button, Form, Input } from 'rsuite';
import { useLocation, matchPath, useNavigate, Routes, Route } from 'react-router-dom';
import NavbarComponent from './components/Navbar';
import Dashboard from './pages/dashboard';

import 'rsuite/dist/rsuite.min.css';
import "./App.less";

function App() {
  return (
    <>
      <NavbarComponent />
      <Container style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;





