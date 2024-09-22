// src/pages/MainPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery}`);
        }
    };

    return (
        <div className="container text-center mt-5">
            <h1 className="mb-4">Welcome to GitHub Analyzer</h1>
            <p className="lead mb-4">Search for GitHub repositories and contributors all in one place.</p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="d-flex justify-content-center mb-5">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search for repositories or authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '400px', marginRight: '10px' }}
                    required
                />
                <button type="submit" className="btn btn-primary">Search</button>
            </form>

            <div className="row mt-5">
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Explore Popular Repositories</h5>
                            <p className="card-text">
                                View top trending repositories on GitHub, sorted by stars and forks.
                            </p>
                            <a href="/explore" className="btn btn-outline-primary">Explore Repositories</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
