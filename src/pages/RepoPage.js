// src/pages/RepoPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import githubApi from '../api/github';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { cacheData, getCachedData } from '../utils/apiCache';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RepoPage = () => {
    const { owner, repo } = useParams();
    const [repoData, setRepoData] = useState(null);
    const [commits, setCommits] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [issues, setIssues] = useState([]);
    const [pullRequests, setPullRequests] = useState([]);
    const [healthMetrics, setHealthMetrics] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRepoData = async () => {
            const cacheKey = `repo-${owner}-${repo}`;
            const cachedRepo = getCachedData(cacheKey);

            if (cachedRepo) {
                const { repo, commits, contributors, issues, pullRequests, healthMetrics } = cachedRepo;
                setRepoData(repo);
                setCommits(commits);
                setContributors(contributors);
                setIssues(issues);
                setPullRequests(pullRequests);
                setHealthMetrics(healthMetrics);
                setLoading(false);
            } else {
                try {
                    const [repoResponse, commitResponse, contributorResponse, issueResponse, prResponse] = await Promise.all([
                        githubApi.get(`/repos/${owner}/${repo}`),
                        githubApi.get(`/repos/${owner}/${repo}/commits`),
                        githubApi.get(`/repos/${owner}/${repo}/contributors`),
                        githubApi.get(`/repos/${owner}/${repo}/issues?state=open`),
                        githubApi.get(`/repos/${owner}/${repo}/pulls?state=all`)
                    ]);


                    const repoData = {
                        repo: repoResponse.data,
                        commits: commitResponse.data,
                        contributors: contributorResponse.data,
                        issues: issueResponse.data,
                        pullRequests: prResponse.data,
                    };

                    cacheData(cacheKey, repoData);

                    setRepoData(repoResponse.data);
                    setCommits(commitResponse.data);
                    setContributors(contributorResponse.data);
                    setIssues(issueResponse.data);
                    setPullRequests(prResponse.data);
                    setLoading(false);
                } catch (err) {
                    setError('Failed to load repository data.');
                    setLoading(false);
                }
            }
        };

        fetchRepoData();
    }, [owner, repo]);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger mt-5">{error}</div>;

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">{repoData.full_name}</h1>
            <p className="text-center">{repoData.description}</p>

            {/* Stats in Badges */}
            <div className="row mb-4 text-center">
                <div className="col">
                    <span className="badge badge-primary  p-2">⭐ Stars: {repoData.stargazers_count}</span>
                </div>
                <div className="col">
                    <span className="badge badge-success  p-2">🍴 Forks: {repoData.forks_count}</span>
                </div>
                <div className="col">
                    <span className="badge badge-info  p-2">👀 Watchers: {repoData.watchers_count}</span>
                </div>
                <div className="col">
                    <span className="badge badge-warning  p-2">🐛 Open Issues: {repoData.open_issues_count}</span>
                </div>
                <div className="col">
                    <span className="badge badge-danger text-white p-2">🔄 Last Commit: {new Date(repoData.pushed_at).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Visit GitHub Profile Button */}
            <div className="text-center mb-4">
                <a href={repoData.html_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">Visit Repository on GitHub</a>
                <Link to={`/author/${owner}`} className="btn btn-outline-success">Visit {owner}'s Profile</Link>
            </div>

           

            {/* Tab Navigation */}
            <ul className="nav nav-tabs mt-5">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'commits' ? 'active' : ''}`} onClick={() => setActiveTab('commits')}>Commits</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'contributors' ? 'active' : ''}`} onClick={() => setActiveTab('contributors')}>Contributors</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'issues' ? 'active' : ''}`} onClick={() => setActiveTab('issues')}>Issues</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'pullRequests' ? 'active' : ''}`} onClick={() => setActiveTab('pullRequests')}>Pull Requests</button>
                </li>
            </ul>

            {/* Tab Content */}
            <div>
                {activeTab === 'overview' && (
                    <div>
                        <h2 className="mb-4">Repository Overview</h2>
                        <ul className="list-group">
                            <li className="list-group-item"><strong>Primary Language:</strong> {repoData.language}</li>
                            <li className="list-group-item"><strong>License:</strong> {repoData.license?.name || 'No License'}</li>
                            <li className="list-group-item"><strong>Created At:</strong> {new Date(repoData.created_at).toLocaleDateString()}</li>
                            <li className="list-group-item"><strong>Last Updated:</strong> {new Date(repoData.updated_at).toLocaleDateString()}</li>
                        </ul>
                    </div>
                )}
                {activeTab === 'commits' && (
                    <div>
                        <h2 className="mb-4">Commit History</h2>
                        <ul className="list-group">
                            {commits.map(commit => (
                                <li key={commit.sha} className="list-group-item">
                                    <p><strong>{commit.commit.message}</strong></p>
                                    <small>
                                        Author: <Link to={`/author/${commit.author?.login}`} className="text-success">
                                            {commit.commit.author.name || commit.author?.login}
                                        </Link> on {new Date(commit.commit.author.date).toLocaleString()}
                                        &mdash; <a href={commit.html_url} target="_blank" rel="noopener noreferrer">View on GitHub</a>
                                    </small>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {activeTab === 'contributors' && (
                    <div>
                        <h2 className="text-center">Top Contributors</h2>
                        <ul className="list-group">
                            {contributors.map(contributor => (
                                <li key={contributor.id} className="list-group-item d-flex align-items-center">
                                    <img src={contributor.avatar_url} alt={contributor.login} className="rounded-circle mr-3" style={{ width: '40px', height: '40px' }} />
                                    <Link to={`/author/${contributor.login}`} className="text-primary">
                                        {contributor.login}
                                    </Link>
                                    &mdash; <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">View on GitHub</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {activeTab === 'issues' && (
                    <div>
                        <h2 className="text-center">Issues</h2>
                        <ul className="list-group">
                            {issues.map(issue => (
                                <li key={issue.id} className="list-group-item">
                                    <p><strong>{issue.title}</strong></p>
                                    <small>
                                        Created by <a href={issue.user.html_url} target="_blank" rel="noopener noreferrer">{issue.user.login}</a> on {new Date(issue.created_at).toLocaleString()}
                                    </small>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {activeTab === 'pullRequests' && (
                    <div>
                        <h2 className="text-center">Pull Requests</h2>
                        <ul className="list-group">
                            {pullRequests.map(pr => (
                                <li key={pr.id} className="list-group-item">
                                    <p><strong>{pr.title}</strong></p>
                                    <small>
                                        Created by <a href={pr.user.html_url} target="_blank" rel="noopener noreferrer">{pr.user.login}</a> on {new Date(pr.created_at).toLocaleDateString()}
                                    </small>
                                    <span>{pr.state === 'open' ? '🔓 Open' : pr.merged_at ? '✅ Merged' : '❌ Closed'}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepoPage;
