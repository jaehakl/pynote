import axios from 'axios';
let GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
let YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// === GitHub ===
export const getGithubContents = (owner, repo, path = '') => axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {headers: {'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`}});
export const searchGithubRepos = (query, limit = 10) => axios.get(`https://api.github.com/search/repositories?q=${query}&per_page=${limit}`, {headers: {'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`}});
export const getGithubRepoInfo = (owner, repo) => axios.get(`https://api.github.com/repos/${owner}/${repo}`, {headers: {'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`}});
export const getPublicRepositories = (username, perPage = 100) => axios.get(`https://api.github.com/users/${username}/repos?per_page=${perPage}&sort=updated`, {headers: {'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`}});
export const getUserRepositories = (perPage = 100) => axios.get(`https://api.github.com/user/repos?per_page=${perPage}&sort=updated`, {headers: {'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`}});

// === Tistory === // CORS 우회를 위해 프록시 서비스 사용
export const getTistoryContents = (url) => axios.get(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);

// === YouTube ===
export const getPlaylistItems = (playlistId, maxResults = 50, pageToken = null) => axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, { params: {part: 'snippet,contentDetails',playlistId: playlistId,maxResults: maxResults,key: YOUTUBE_API_KEY,pageToken: pageToken}});
export const getPlaylistInfo = (playlistId) => axios.get(`https://www.googleapis.com/youtube/v3/playlists`, { params: {part: 'snippet,contentDetails',id: playlistId,key: YOUTUBE_API_KEY}});
export const getVideoInfo = (videoIds) => axios.get(`https://www.googleapis.com/youtube/v3/videos`, { params: {part: 'snippet,contentDetails,statistics',id: videoIds,key: YOUTUBE_API_KEY}});    