// src/api/github.js
import axios from 'axios';

// Retrieve the GitHub token from environment variables
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

// Create an Axios instance with the GitHub token included in the headers
const githubApi = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
    },
});

export default githubApi;
