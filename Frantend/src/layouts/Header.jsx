import React from 'react';
import '../assets/styles/Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-logo">Global Nation Academy</div>
            <nav className="header-nav">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#category">Category</a>
                {/* <a href="#team">Team</a> */}
                <a href="#faqs">FAQs</a>
            </nav>
            <div className="header-actions">
                {/* <a href="/register" className="login">Register</a> */}
                <a href="/login" className="signup">Student</a>
            </div>
        </header>
    );
};

export default Header;
