// src/pages/SearchResults.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import githubApi from '../api/github';
import { cacheData, getCachedData } from '../utils/apiCache';

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(Number(new URLSearchParams(location.search).get('page')) || 1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setError(null);

            const cacheKey = `search-${query}-${page}`;
            const cachedSearch = getCachedData(cacheKey);

            if (cachedSearch) {
                setResults(cachedSearch.results);
                setTotalPages(cachedSearch.totalPages);
                setLoading(false);
            } else {
                try {
                    const [repoResponse, userResponse] = await Promise.all([
                        githubApi.get(`/search/repositories?q=${query}&page=${page}&per_page=5`),
                        githubApi.get(`/search/users?q=${query}&page=${page}&per_page=5`)
                    ]);

                    const combinedResults = [
                        ...repoResponse.data.items.map(item => ({ ...item, type: 'repository' })),
                        ...userResponse.data.items.map(item => ({ ...item, type: 'user' }))
                    ];

                    const totalRepos = repoResponse.data.total_count;
                    const totalUsers = userResponse.data.total_count;
                    const totalPages = Math.ceil(Math.max(totalRepos, totalUsers) / 5); // 5 items per page

                    cacheData(cacheKey, { results: combinedResults, totalPages });

                    setResults(combinedResults);
                    setTotalPages(totalPages);
                    setLoading(false);
                } catch (err) {
                    setError('Failed to load search results.');
                    setLoading(false);
                }
            }
        };

        fetchResults();
    }, [query, page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        navigate(`/search?q=${query}&page=${newPage}`);
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger mt-5">{error}</div>;

    const pageRange = () => {
        let startPage = Math.floor((page - 1) / 5) * 5 + 1;
        let endPage = Math.min(startPage + 4, totalPages);
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Search Results for "{query}"</h2>
            <div className="row">
                {results.map((result) => (
                    <div key={result.id} className="col-md-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body d-flex">
                                {result.type === 'repository' ? (
                                    <>
                                        {/* Repository author avatar */}
                                        <img
                                            src={result.owner.avatar_url}
                                            alt={result.owner.login}
                                            className="rounded-circle mr-3"
                                            style={{ width: '50px', height: '50px' }}
                                        />
                                        <div>
                                            <h5 className="card-title">
                                                <Link to={`/repo/${result.owner.login}/${result.name}`} className="text-primary">
                                                    {result.name}
                                                </Link>
                                            </h5>
                                            {/* Link to author's profile on our site */}
                                            <h6 className="card-subtitle mb-2 text-muted">
                                                By <Link to={`/author/${result.owner.login}`} className="text-success">
                                                    {result.owner.login}
                                                </Link>
                                            </h6>
                                            <p className="card-text">{result.description || 'No description available'}</p>
                                            <small className="text-muted">
                                                ⭐ {result.stargazers_count} | 🍴 {result.forks_count} | Issues: {result.open_issues_count}
                                            </small>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* User avatar */}
                                        <img
                                            src={result.avatar_url}
                                            alt={result.login}
                                            className="rounded-circle mr-3"
                                            style={{ width: '50px', height: '50px' }}
                                        />
                                        <div>
                                            <h5 className="card-title">
                                                <Link to={`/author/${result.login}`} className="text-success">
                                                    {result.login}
                                                </Link>
                                            </h5>
                                            <p className="card-text">
                                                GitHub Profile: <a href={result.html_url} target="_blank" rel="noopener noreferrer">{result.html_url}</a>
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center mt-4">
                    {page > 1 && (
                        <li className="page-item">
                            <button className="page-link" onClick={() => handlePageChange(page - 1)}>Previous</button>
                        </li>
                    )}
                    {pageRange().map((pageNum) => (
                        <li key={pageNum} className={`page-item ${pageNum === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(pageNum)}>
                                {pageNum}
                            </button>
                        </li>
                    ))}
                    {page < totalPages && (
                        <li className="page-item">
                            <button className="page-link" onClick={() => handlePageChange(page + 1)}>Next</button>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default SearchResults;
