import React, { useState, useEffect } from 'react';
import { getPlaylistItems, getVideoInfo } from '../api/api';
import './youtube.css';

const YouTubePlaylist = ({ playlistId, maxResults = 50, dataUpdated=null }) => {
  const [videos, setVideos] = useState([]);
  const [videoDetails, setVideoDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  const [expandedVideos, setExpandedVideos] = useState(new Set());

  // YouTube iframe API 로드
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  useEffect(() => {
    if (dataUpdated) {
      dataUpdated(videoDetails);
    }
  }, [videoDetails]);

  const fetchVideos = async (pageToken = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getPlaylistItems(playlistId, maxResults, pageToken);
      const newVideos = response.data.items || [];
      
      if (pageToken) {
        // 추가 페이지 로드
        setVideos(prev => [...prev, ...newVideos]);
      } else {
        // 첫 페이지 로드
        setVideos(newVideos);
      }
      
      setNextPageToken(response.data.nextPageToken || null);
      setHasMoreVideos(!!response.data.nextPageToken);
      
      // 새로 추가된 영상들의 상세 정보 가져오기
      if (newVideos.length > 0) {
        fetchVideoDetails(newVideos);
      }
    } catch (err) {
      let errorMessage = '재생목록을 불러올 수 없습니다.';
      
      if (err.response) {
        if (err.response.status === 403) {
          errorMessage = 'YouTube API 할당량이 초과되었습니다. 잠시 후 다시 시도해주세요.';
        } else if (err.response.status === 404) {
          errorMessage = '재생목록을 찾을 수 없습니다. 재생목록 ID를 확인해주세요.';
        } else if (err.response.status === 400) {
          errorMessage = '잘못된 요청입니다. 재생목록 ID를 확인해주세요.';
        } else {
          errorMessage = `API 오류 (${err.response.status}): ${err.response.data?.error?.message || err.message}`;
        }
      }
      
      setError(errorMessage);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideoDetails = async (videoList) => {
    try {
      const videoIds = videoList
        .map(item => item.contentDetails.videoId)
        .filter(id => id && !videoDetails[id]); // 이미 가져온 영상은 제외
      
      if (videoIds.length === 0) return;
      
      // 한 번에 최대 50개까지 요청 가능
      const batchSize = 50;
      for (let i = 0; i < videoIds.length; i += batchSize) {
        const batch = videoIds.slice(i, i + batchSize);
        const response = await getVideoInfo(batch.join(','));
        
        if (response.data.items) {
          const newDetails = {};
          response.data.items.forEach(video => {
            newDetails[video.id] = video;
          });
          setVideoDetails(prev => ({ ...prev, ...newDetails }));
        }
      }
    } catch (err) {
      console.error('영상 상세 정보를 가져올 수 없습니다:', err);
    }
  };

  const loadMoreVideos = () => {
    if (nextPageToken && !loading) {
      fetchVideos(nextPageToken);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleVideo = (videoId) => {
    setExpandedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  // 마우스 휠을 가로 스크롤로 변환하는 함수
  const handleWheel = (e) => {
    e.preventDefault();
    const container = e.currentTarget;
    container.scrollLeft += e.deltaY;
  };

  useEffect(() => {
    if (playlistId) {
      fetchVideos();
    }
  }, [playlistId]);

  if (!playlistId) {
    return (
      <div className="youtube-container">
        <div className="youtube-error">
          재생목록 ID를 입력해주세요.
        </div>
      </div>
    );
  }

  return (
    <div className="youtube-container">
      {/* 에러 메시지 */}
      {error && (
        <div className="youtube-error">
          <p>{error}</p>
        </div>
      )}

      {/* 영상 목록 */}
      {videos.length > 0 && (
        <div className="videos-grid">
          {videos.map((item, index) => {
            const videoId = item.contentDetails.videoId;
            const isExpanded = expandedVideos.has(videoId);
            
            return (
              <div key={item.id} className="video-card">
                <div 
                  className="video-embed-container"
                  onClick={() => toggleVideo(videoId)}
                >
                  {isExpanded ? (
                    <iframe
                      width="100%"
                      height="120"
                      src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3&fs=0&disablekb=1&autohide=1&color=white&autoplay=1`}
                      title={item.snippet.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="video-thumbnail">
                      <img 
                        src={item.snippet.thumbnails.medium.url} 
                        alt={item.snippet.title}
                        loading="lazy"
                      />
                      <div className="play-overlay">
                        <div className="play-button">▶️</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="video-info">
                  <h5 className="video-title" title={item.snippet.title}>
                    {item.snippet.title}
                  </h5>
                  <p className="video-channel">{item.snippet.videoOwnerChannelTitle}</p>
                  <p className="video-date">{formatDate(item.snippet.publishedAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 더 보기 버튼 */}
      {hasMoreVideos && videos.length > 0 && (
        <div className="load-more-container">
          <button 
            className="load-more-btn" 
            onClick={loadMoreVideos}
            disabled={loading}
          >
            {loading ? '로딩 중...' : '더 보기'}
          </button>
        </div>
      )}

      {/* 로딩 상태 */}
      {loading && videos.length === 0 && (
        <div className="youtube-loading">
          <p>재생목록을 불러오는 중...</p>
        </div>
      )}
    </div>
  );
};

export default YouTubePlaylist;
