import React, { useState, useEffect } from 'react';
import { Container, Content, Sidebar, Button, Form, Input } from 'rsuite';
import { useLocation, matchPath, useNavigate } from 'react-router-dom';
import GitHubExplorer from './pages/github';

import 'rsuite/dist/rsuite.min.css';
import "./App.less";



function App() {

  return (
    <Container>

      <Sidebar>
      </Sidebar>
      <Content>
        <div>
          <h1>Pynote Note</h1>
          <GitHubExplorer />
        </div>
      </Content>
    </Container>
  );
}

export default App;





