// src/pages/ExplorePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import githubApi from '../api/github';

const ExplorePage = () => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPopularRepos = async () => {
            try {
                const response = await githubApi.get('/search/repositories?q=stars:>10000&sort=stars&order=desc&per_page=10');
                setRepos(response.data.items);
                setLoading(false);
            } catch (err) {
                setError('Failed to load repositories.');
                setLoading(false);
            }
        };

        fetchPopularRepos();
    }, []);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger mt-5">{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Explore Popular Repositories</h2>
            <div className="row">
                {repos.map(repo => (
                    <div key={repo.id} className="col-md-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">
                                    <Link to={`/repo/${repo.owner.login}/${repo.name}`} className="text-primary">
                                        {repo.name}
                                    </Link>
                                </h5>
                                <h6 className="card-subtitle mb-2 text-muted">By {repo.owner.login}</h6>
                                <p className="card-text">{repo.description || "No description available"}</p>
                            </div>
                            <div className="card-footer">
                                <small className="text-muted">
                                    ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count} | Issues: {repo.open_issues_count}
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExplorePage;
