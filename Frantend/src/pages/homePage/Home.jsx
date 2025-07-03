import React from 'react';
import '../../assets/styles/Home.css';

const Home = () => {
    return (
        <section id="home" className="home-container">
            <div className="home-content">
                <h1>Embark on a Journey of <span className="highlight">Knowledge</span></h1>
                <p>
                    Join us and discover the limitless possibilities that await as you embark on a transformative quest for learning and personal growth.Join us and discover the limitless possibilities that await as you embark on a transformative quest for learning and personal growth.Join us and discover the limitless possibilities that await as you embark on a transformative quest for learning and personal growth.Join us and discover the limitless possibilities that await as you embark on a transformative quest for learning and personal growth.
                </p>
                <button className="start-button">Start  →</button>
                <div className="reviews">
                    <span>From 40k+ Reviews</span>
                    <div className="reviewers">
                        <img src="/assets/student.jpg" alt="User1" />
                        <img src="/assets/user2.jpg" alt="User2" />
                        <img src="/assets/user3.jpg" alt="User3" />
                        <span className="rating">⭐ 4.9</span>
                    </div>
                </div>
            </div>
            <div className="home-image">
                <img src="/assets/student.jpg" alt="Student holding notebooks" />
                <div className="stats">
                    <div>
                        <h2>40x</h2>
                        <p>Maximum effectiveness and efficiency, outshining all other tools for learning assistance.</p>
                    </div>
                    <div>
                        <h2>100%</h2>
                        <p>Our Guaranteed Learning Management System provides valuable data and analytics.</p>
                    </div>
                </div>
                {/* <div className="chart">
                    <img src="/assets/image/student.png" alt="Study Statistic Chart" />
                </div> */}
            </div>
        </section>
    );
};

export default Home;
