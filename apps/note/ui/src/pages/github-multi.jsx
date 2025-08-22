import React from 'react';
import GitHubExplorer from '../components/github';
import './github-multi.css';

const GitHubMultiExplorer = () => {
  return (
    <div className="github-multi-explorer">          
        <GitHubExplorer owner="jaehakl" repo="ProposalHub" showList={true}/>
        <GitHubExplorer owner="jaehakl" repo="waveform" subpath="docs" showList={true}/>
    </div>
  );
};

export default GitHubMultiExplorer;
