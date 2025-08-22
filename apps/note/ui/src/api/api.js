import axios from 'axios';
let GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

// === GitHub ===
export const getGithubContents = (owner, repo, path = '') => axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {headers: {'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`}});
export const searchGithubRepos = (query, limit = 10) => axios.get(`https://api.github.com/search/repositories?q=${query}&per_page=${limit}`, {headers: {'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`}});
export const getGithubRepoInfo = (owner, repo) => axios.get(`https://api.github.com/repos/${owner}/${repo}`, {headers: {'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`}});
export const getUserRepositories = (username, perPage = 100) => axios.get(`https://api.github.com/users/${username}/repos?per_page=${perPage}&sort=updated`, {headers: {'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`}});
