import React, { useState, useEffect } from 'react';
import { Container, Content, Sidebar, Button } from 'rsuite';
import GitHubExplorer from '../components/github';
import TistoryRSS from '../components/tistory';
import YouTubePlaylist from '../components/youtube';
import { getPublicRepositories } from '../api/api';
import './dashboard.css';

const OWNER = "jaehakl";
const GITHUB_REPO_NAME = "ProposalHub";
const YOUTUBE_PLAYLIST_ID = "PL2xobfxfMTdvAeqsSs_azx-x3hCZAt_KE";
const TISTORY_RSS_URL = "https://identicalparticle.com/rss";


function Dashboard() {
  const [youtubeData, setYoutubeData] = useState(null);
  const [tistoryData, setTistoryData] = useState(null);
  const [githubData, setGithubData] = useState({});
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const fetchRepos = async () => {
        const response = await getPublicRepositories(OWNER);
            setRepos(response.data);
        }
        fetchRepos();
    }, []);  

  const handleGithubDataUpdated = (id, data) => {
    setGithubData(prev => ({ ...prev, [id]: data }));
  }

  const collectData = async () => {
    const data = {
      youtube: youtubeData,
      tistory: tistoryData,
      github: githubData
    }
    
    // 마크다운 텍스트 생성
    let markdown = '# 데이터 수집 결과\n\n';
    
    // YouTube 데이터
    if (youtubeData && Object.keys(youtubeData).length > 0) {
      markdown += '## YouTube 플레이리스트\n\n';
      Object.entries(youtubeData).forEach(([videoId, videoData], index) => {
        if (videoData.snippet) {
          markdown += `${index + 1}. [${videoData.snippet.title}](https://www.youtube.com/watch?v=${videoId})\n`;
          markdown += `   - 설명: ${videoData.snippet.description ? videoData.snippet.description : '설명 없음'}\n`;
          markdown += `   - 업로드: ${new Date(videoData.snippet.publishedAt).toLocaleDateString('ko-KR')}\n`;
          if (videoData.snippet.channelTitle) {
            markdown += `   - 채널: ${videoData.snippet.channelTitle}\n`;
          }
          markdown += '\n';
        }
      });
    }
    
    // Tistory 데이터
    if (tistoryData && Array.isArray(tistoryData) && tistoryData.length > 0) {
      markdown += '## Tistory 블로그 포스트\n\n';
      tistoryData.forEach((item, index) => {
        markdown += `### ${index + 1}. [${item.title}](${item.link})\n`;
        markdown += `   - 요약: ${item.description ? item.description : '요약 없음'}\n`;
        markdown += `   - 발행일: ${new Date(item.pubDate).toLocaleDateString('ko-KR')}\n\n`;
      });
    }
    
    // GitHub 데이터
    if (githubData && Object.keys(githubData).length > 0) {
      markdown += '## GitHub 저장소\n\n';
      Object.entries(githubData).forEach(([repoName, repoData]) => {
        if (repoData && repoData.readme) {
          markdown += `### ${repoName}\n`;
          

          const description = repoData.readme;
          
          if (description) {
            markdown += `${description}\n\n`;
          }
          
          markdown += `🔗 [GitHub 링크](https://github.com/${OWNER}/${repoName})\n\n`;
        }
      });
    }
    
    try {
      await navigator.clipboard.writeText(markdown);
    } catch (err) {
      alert('클립보드 복사에 실패했습니다.');
    }
    
    console.log('생성된 마크다운:', markdown);
  }

  return (
    <>
      <Sidebar style={{ minWidth: '300px' }}>
        <YouTubePlaylist playlistId={YOUTUBE_PLAYLIST_ID} maxResults={20} dataUpdated={setYoutubeData}/>
      </Sidebar>
      <Content>
        <div className="dashboard-header">
          <h1>데이터 대시보드</h1>
          <Button 
            appearance="primary" 
            size="lg"
            onClick={collectData}
            className="collect-data-btn"
          >
            📋 데이터 수집 및 복사
          </Button>
        </div>
        <GitHubExplorer owner={OWNER} repo={GITHUB_REPO_NAME} showList={true} dataUpdated={(data) => handleGithubDataUpdated(GITHUB_REPO_NAME, data)}/>      
        <div className="github-multi-explorer">          
        {repos.map((repo) => (
            <div key={repo.id} style={{margin: "0", padding: "0"}}>
                <GitHubExplorer owner={OWNER} repo={repo.name} showReadme={true} dataUpdated={(data) => handleGithubDataUpdated(repo.name, data)}/>
            </div>
        ))}
        </div>
      </Content>
      <Sidebar style={{ minWidth: '400px' }}>
        <TistoryRSS url={TISTORY_RSS_URL} dataUpdated={setTistoryData}/>
      </Sidebar>
    </>
  );
}

export default Dashboard;
