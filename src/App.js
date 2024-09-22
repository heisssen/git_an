// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ExplorePage from './pages/ExplorePage';
import ContributorsPage from './pages/ContributorsPage';
import RepoPage from './pages/RepoPage';
import AuthorPage from './pages/AuthorPage';
import SearchResults from './pages/SearchResults';
import Navbar from './components/Navbar'; // Import Navbar

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/contributors" element={<ContributorsPage />} />
                <Route path="/repo/:owner/:repo" element={<RepoPage />} />
                <Route path="/author/:author" element={<AuthorPage />} />
                <Route path="/search" element={<SearchResults />} />
            </Routes>
        </Router>
    );
};

export default App;
