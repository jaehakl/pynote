import React, { useState, useEffect } from 'react';
import { Container, Content, Sidebar, Button, Form, Input } from 'rsuite';
import { useLocation, matchPath, useNavigate, Routes, Route } from 'react-router-dom';
import GitHubExplorer from './components/github';
import GitHubMultiExplorer from './pages/github-multi';
import TistoryRSS from './components/tistory';
import YouTubePlaylist from './components/youtube';
import NavbarComponent from './components/Navbar';

import 'rsuite/dist/rsuite.min.css';
import "./App.less";

function App() {
  return (
    <>
      <NavbarComponent />
      <Container style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={
            <>
              <Sidebar style={{ minWidth: '300px' }}>
                <YouTubePlaylist playlistId="PL2xobfxfMTdvAeqsSs_azx-x3hCZAt_KE" maxResults={20} />
              </Sidebar>
              <Content>
                <GitHubExplorer owner="jaehakl" repo="ProposalHub" showList={true}/>      
                <GitHubMultiExplorer owner="jaehakl"/>    
              </Content>
              <Sidebar style={{ minWidth: '400px' }}>
                <TistoryRSS url="https://identicalparticle.com/rss" />
              </Sidebar>
            </>
          } />
          <Route path="/github" element={
            <Content>
              <GitHubExplorer owner="jaehakl" repo="ProposalHub" showList={true}/>      
              <GitHubMultiExplorer owner="jaehakl"/>    
            </Content>
          } />
          <Route path="/blog" element={
            <Content>
              <TistoryRSS url="https://identicalparticle.com/rss" />
            </Content>
          } />
          <Route path="/youtube" element={
            <Content>
              <YouTubePlaylist playlistId="PL2xobfxfMTdvAeqsSs_azx-x3hCZAt_KE" maxResults={20} />
            </Content>
          } />
        </Routes>
      </Container>
    </>
  );
}

export default App;





