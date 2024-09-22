// src/pages/AuthorPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import githubApi from '../api/github';
import { cacheData, getCachedData } from '../utils/apiCache';

const AuthorPage = () => {
    const { author } = useParams();
    const [authorData, setAuthorData] = useState(null);
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAuthorData = async () => {
            const cacheKey = `author-${author}`;
            const cachedData = getCachedData(cacheKey);

            if (cachedData) {
                setAuthorData(cachedData.authorData);
                setRepos(cachedData.repos);
                setLoading(false);
            } else {
                try {
                    const authorResponse = await githubApi.get(`/users/${author}`);
                    const reposResponse = await githubApi.get(`/users/${author}/repos`);

                    cacheData(cacheKey, {
                        authorData: authorResponse.data,
                        repos: reposResponse.data
                    });

                    setAuthorData(authorResponse.data);
                    setRepos(reposResponse.data);
                    setLoading(false);
                } catch (err) {
                    setError('Failed to load author data.');
                    setLoading(false);
                }
            }
        };

        fetchAuthorData();
    }, [author]);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger mt-5">{error}</div>;

    return (
        <div className="container mt-5">
            {/* Profile Header */}
            <div className="profile-header text-center mb-5">
                <img
                    src={authorData.avatar_url}
                    alt={authorData.login}
                    className="rounded-circle mb-3"
                    style={{ width: '150px', height: '150px' }}
                />
                <h1 className="mb-1">{authorData.name || authorData.login}</h1>
                <p className="text-muted mb-2">@{authorData.login}</p>
                {authorData.bio && <p className="lead">{authorData.bio}</p>}

                {/* Visit GitHub Profile Button */}
                <div className="mt-3">
                    <a href={authorData.html_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                        Visit {authorData.login}'s GitHub Profile
                    </a>
                </div>

                {/* Followers and Following */}
                <div className="mt-4">
                    <span className="badge badge-info p-2 mr-3">👥 Followers: {authorData.followers}</span>
                    <span className="badge badge-secondary p-2">👤 Following: {authorData.following}</span>
                </div>
            </div>

            {/* Repositories Section */}
            <div className="repositories">
                <h2 className="text-center mb-4">Repositories by {authorData.login}</h2>
                <div className="row">
                    {repos.map(repo => (
                        <div key={repo.id} className="col-md-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <a href={`/repo/${author}/${repo.name}`} className="text-primary">{repo.name}</a>
                                    </h5>
                                    <p className="card-text">{repo.description || 'No description available'}</p>
                                </div>
                                <div className="card-footer">
                                    <small className="text-muted">
                                        ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count} | 👀 {repo.watchers_count}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuthorPage;
