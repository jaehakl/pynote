import React, { useState, useEffect } from 'react';
import { Container, Content, Sidebar, Button, Form, Input } from 'rsuite';
import { useLocation, matchPath, useNavigate } from 'react-router-dom';
import GitHubExplorer from './components/github';
import GitHubMultiExplorer from './pages/github-multi';

import 'rsuite/dist/rsuite.min.css';
import "./App.less";



function App() {

  return (
    <Container>
      <Content>
        <div>
          <h1>Pynote Note</h1>
          
          {/* GitHub Multi Explorer */}
          <GitHubMultiExplorer />
          

        </div>
      </Content>
    </Container>
  );
}

export default App;





