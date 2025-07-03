import React from "react";
import "../../assets/styles/AboutUs.css";

const AboutUs = () => {
  return (
    <section id="about" className="about-container">
      <div className="about-header">
        <div>
          <h1>
            About Us : Journey of <span className="highlight">Empowerment</span>
          </h1>
        </div>
        <div className="about-description">
          <p>
            We are passionate about helping study transformative journeys
            towards achieving their goals.
          </p>
          <button className="how-button">▶ How it works?</button>
        </div>
      </div>

      <div className="about-images">
        <img src="/assets/team1.jpg" alt="Team 1" className="about-img" />
        <img src="/assets/team2.jpg" alt="Team 2" className="about-img" />
        <img src="/assets/team3.jpg" alt="Team 3" className="about-img" />
        <img src="/assets/team2.jpg" alt="Team 2" className="about-img" />
        <img src="/assets/team3.jpg" alt="Team 3" className="about-img" />
      </div>
    </section>
  );
};

export default AboutUs;
