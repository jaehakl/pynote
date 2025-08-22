import React, { useState, useEffect } from 'react';
import GitHubExplorer from '../components/github';
import './github-multi.css';
import { getPublicRepositories } from '../api/api';

const GitHubMultiExplorer = ({owner}) => {
    const [repos, setRepos] = useState([]);
    useEffect(() => {
        const fetchRepos = async () => {
            const response = await getPublicRepositories(owner);
            setRepos(response.data);
        }
        fetchRepos();
    }, []);


  return (
    <div className="github-multi-explorer">          
        {repos.map((repo) => (
            <div key={repo.id} style={{margin: "0", padding: "0"}}>
                <GitHubExplorer owner={owner} repo={repo.name} showReadme={true}/>
            </div>
        ))}
    </div>
  );
};

export default GitHubMultiExplorer;
