import React, { useState, useEffect } from 'react';
import './tistory.css';
import { getTistoryContents } from '../api/api';

const TistoryRSS = ({url}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // HTML 엔티티 디코딩 함수
  const decodeHtmlEntities = (text) => {
    if (!text) return '';
    
    // 임시 DOM 요소 생성하여 HTML 엔티티 디코딩
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // HTML 태그 제거 함수
  const stripHtmlTags = (html) => {
    if (!html) return '';
    
    // 임시 DOM 요소 생성하여 HTML 파싱
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // 텍스트만 추출
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // RSS 파싱 함수
  const parseRSS = (xmlText) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    const items = xmlDoc.querySelectorAll('item');
    const parsedPosts = [];
    
    items.forEach((item) => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      
      parsedPosts.push({
        title: decodeHtmlEntities(title).trim(),
        link: link.trim(),
        pubDate: pubDate.trim(),
        description: decodeHtmlEntities(stripHtmlTags(description)).trim()
      });
    });
    
    return parsedPosts;
  };

  // RSS 데이터 가져오기
  const fetchRSS = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getTistoryContents(url);
      
      if (response.data) {
        const parsedPosts = parseRSS(response.data);
        setPosts(parsedPosts);
      }
    } catch (err) {
      console.error('RSS 가져오기 실패:', err);
      setError('RSS 데이터를 가져오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // 링크 클릭 핸들러
  const handleLinkClick = (url) => {
    window.open(url, '_blank');
  };

  useEffect(() => {
    fetchRSS();
  }, []);

  return (
    <div className="tistory-rss-container">

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>RSS 데이터를 가져오는 중...</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="posts-container">
          <h3>📝 최신 게시글 ({posts.length}개)</h3>
          <div className="posts-list">
            {posts.map((post, index) => (
              <div key={index} className="post-item">
                <div className="post-header">
                  <h4 className="post-title" onClick={() => handleLinkClick(post.link)}>
                    {post.title}
                  </h4>
                  <span className="post-date">{formatDate(post.pubDate)}</span>
                </div>
                {post.description && (
                  <p className="post-description">
                    {post.description.length > 100 
                      ? `${post.description.substring(0, 100)}...` 
                      : post.description
                    }
                  </p>
                )}
                <div className="post-actions">
                  <button 
                    className="read-more-btn"
                    onClick={() => handleLinkClick(post.link)}
                  >
                    읽어보기 →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="no-posts">
          <p>게시글이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default TistoryRSS;
