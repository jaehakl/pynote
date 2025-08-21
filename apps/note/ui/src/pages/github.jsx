import React, { useState, useEffect } from 'react';
import { getGithubContents, getGithubRepoInfo } from '../api/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { remark } from 'remark';
import './github.css';

const GitHubExplorer = () => {
  const [owner, setOwner] = useState('jaehakl');
  const [repo, setRepo] = useState('pynote');
  const [path, setPath] = useState('');
  const [contents, setContents] = useState([]);
  const [repoInfo, setRepoInfo] = useState(null);
  const [readmeContent, setReadmeContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);


  const fetchContents = async () => {
    setLoading(true);
    setError(null);
    setReadmeContent(null);
    try {
      const response = await getGithubContents(owner, repo, path);
      setContents(response.data);
      
      // 브레드크럼 업데이트
      const pathParts = path.split('/').filter(p => p);
      setBreadcrumbs(pathParts);
      
      // 레포지토리 정보도 함께 가져오기
      const repoResponse = await getGithubRepoInfo(owner, repo);
      setRepoInfo(repoResponse.data);
      
      // README.md 파일이 있는지 확인하고 내용 가져오기
      const readmeFile = response.data.find(item => 
        item.type === 'file' && 
        (item.name.toLowerCase() === 'readme.md' || 
         item.name.toLowerCase() === 'readme.txt' ||
         item.name.toLowerCase() === 'readme')
      );
      
      if (readmeFile) {
        try {
          const readmeResponse = await getGithubContents(owner, repo, readmeFile.path);
          // content가 base64로 인코딩되어 있는지 확인
          if (readmeResponse.data.content && readmeResponse.data.encoding === 'base64') {
            try {
              // base64 디코딩 후 UTF-8로 디코딩하여 한글 깨짐 방지
              const binaryString = atob(readmeResponse.data.content);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const content = new TextDecoder('utf-8').decode(bytes);
              setReadmeContent(content);
            } catch (base64Err) {
              console.log('Base64 디코딩 실패:', base64Err.message);
              // base64 디코딩 실패 시 원본 content 사용 (이미 디코딩된 상태일 수 있음)
              setReadmeContent(readmeResponse.data.content);
            }
          } else {
            // content가 이미 디코딩된 상태이거나 다른 형식인 경우
            setReadmeContent(readmeResponse.data.content || '');
          }
        } catch (readmeErr) {
          console.log('README 파일을 읽을 수 없습니다:', readmeErr.message);
        }
      }
    } catch (err) {
      let errorMessage = err.message;
      
      // 백엔드 API 에러 메시지 개선
      if (err.response) {
        if (err.response.status === 403) {
          errorMessage = 'GitHub API 요청 제한에 도달했습니다. 잠시 후 다시 시도해주세요.';
        } else if (err.response.status === 404) {
          errorMessage = '레포지토리를 찾을 수 없습니다. Owner와 Repository 이름을 확인해주세요.';
        } else if (err.response.status === 401) {
          errorMessage = 'GitHub API 인증이 필요합니다.';
        } else if (err.response.status === 500) {
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        } else {
          errorMessage = `API 오류 (${err.response.status}): ${err.response.data?.detail || err.message}`;
        }
      }
      
      setError(errorMessage);
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [owner, repo, path]);

  const handleItemClick = (item) => {
    if (item.type === 'dir') {
      setPath(item.path);
    } else if (item.type === 'file') {
      // 파일 클릭 시 내용을 새 탭에서 열기
      window.open(`https://github.com/${owner}/${repo}/blob/main/${item.path}`, '_blank');
    }
  };

  const handleBreadcrumbClick = (index) => {
    const newPath = breadcrumbs.slice(0, index + 1).join('/');
    setPath(newPath);
  };

  const handleGoHome = () => {
    setPath('');
  };

  const getFileIcon = (type, name) => {
    if (type === 'dir') return '📁';
    if (name.endsWith('.js') || name.endsWith('.jsx')) return '📄';
    if (name.endsWith('.py')) return '🐍';
    if (name.endsWith('.md')) return '📝';
    if (name.endsWith('.json')) return '⚙️';
    if (name.endsWith('.css') || name.endsWith('.less')) return '🎨';
    if (name.endsWith('.html')) return '🌐';
    return '📄';
  };

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="github-explorer">
      <div className="github-header">
        <h2>GitHub Repository Explorer</h2>
        <div className="repo-inputs">
          <input
            type="text"
            placeholder="Owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="repo-input"
          />
          <span>/</span>
          <input
            type="text"
            placeholder="Repository"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="repo-input"
          />
          <button onClick={fetchContents} className="fetch-btn">
            🔍
          </button>
        </div>
        
        {repoInfo && (
          <div className="repo-info">
            <h3>{repoInfo.name}</h3>
            <p>{repoInfo.description}</p>
            <div className="repo-stats">
              <span>⭐ {repoInfo.stargazers_count}</span>
              <span>🍴 {repoInfo.forks_count}</span>
              <span>👀 {repoInfo.watchers_count}</span>
            </div>
          </div>
        )}
      </div>

      <div className="breadcrumb">
        <button onClick={handleGoHome} className="breadcrumb-item">
          🏠 {owner}/{repo}
        </button>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span className="breadcrumb-separator">/</span>
            <button
              onClick={() => handleBreadcrumbClick(index)}
              className="breadcrumb-item"
            >
              {crumb}
            </button>
          </React.Fragment>
        ))}
      </div>

      {loading && <div className="loading">Loading...</div>}
      
      {error && <div className="error">Error: {error}</div>}
      
      {!loading && !error && (
        <>
          {readmeContent && (
            <div className="readme-section">
              <h3>📖 README</h3>
              <div className="readme-content">
                <ReactMarkdown 
                   remarkPlugins={[remarkGfm]}>
                    {readmeContent}
                 </ReactMarkdown>
              </div>
            </div>
          )}
          
          <div className="contents-list">
            {contents.map((item) => (
              <div
                key={item.path}
                className={`content-item ${item.type}`}
                onClick={() => handleItemClick(item)}
              >
                <span className="item-icon">{getFileIcon(item.type, item.name)}</span>
                <span className="item-name">{item.name}</span>
                {item.type === 'file' && (
                  <span className="item-size">{formatFileSize(item.size)}</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GitHubExplorer;
