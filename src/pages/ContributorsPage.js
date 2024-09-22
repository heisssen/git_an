// src/pages/ContributorsPage.js
import React, { useState, useEffect } from 'react';
import githubApi from '../api/github';
import { cacheData, getCachedData } from '../utils/apiCache';

const ContributorsPage = () => {
    const [contributors, setContributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContributors = async () => {
            const cacheKey = 'contributors';
            const cachedData = getCachedData(cacheKey);

            if (cachedData) {
                setContributors(cachedData);
                setLoading(false);
            } else {
                try {
                    const response = await githubApi.get('/repos/someRepo/contributors');
                    cacheData(cacheKey, response.data);
                    setContributors(response.data);
                    setLoading(false);
                } catch (err) {
                    setError('Failed to load contributors.');
                    setLoading(false);
                }
            }
        };

        fetchContributors();
    }, []);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger mt-5">{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Top Contributors</h2>
            <div className="row">
                {contributors.map(contributor => (
                    <div key={contributor.id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <div className="card-body d-flex align-items-center">
                                <img
                                    src={contributor.avatar_url}
                                    alt={contributor.login}
                                    className="rounded-circle mr-3"
                                    style={{ width: '50px', height: '50px' }}
                                />
                                <div>
                                    <h5 className="card-title">
                                        <a href={`/author/${contributor.login}`} className="text-primary">{contributor.login}</a>
                                    </h5>
                                    <a href={contributor.html_url} target="_blank" rel="noopener noreferrer" className="text-muted">
                                        GitHub Profile
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContributorsPage;
