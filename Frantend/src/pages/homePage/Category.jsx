// category.jsx
import React from "react";
import '../../assets/styles/Category.css';

const Category = () => {
  return (
    <section id="category" className="category-container">
      <div className="left-panel">
        <h1 className="heading">Enhancing As You Remain with Edurise</h1>
        <p className="subtext">
          Discover the passion, dedication, and commitment that drive our team
          as we strive to make a difference in our industry.
        </p>
        <button className="learn-more">Learn More →</button>

        <div className="features">
          <div className="feature">
            <h3>Tracking & Assessment</h3>
            <p>
              Monitoring Progress, Improvement Identification, Targeted Feedback
              for Enhanced Learning Outcomes.
            </p>
          </div>
          <div className="feature">
            <h3>Interactive Learning</h3>
            <p>
              Encourage active engagement, collaboration, and knowledge retention
              among learners.
            </p>
          </div>
          <div className="feature">
            <h3>Centralized Learning</h3>
            <p>
              Learners can access all their learning resources in one place,
              making it convenient and efficient.
            </p>
          </div>
          <div className="feature">
            <h3>Flexibility & Accessibility</h3>
            <p>
              Allows learners to fit their studies into their schedule and
              eliminates geographical limitations.
            </p>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="dashboard">
          <p>Welcome back,</p>
          <span>Here's a report on your study progress this week.</span>
          <div className="courses">
            <div className="course-box purple">4 Courses<br />In Progress</div>
            <div className="course-box green">23 Courses<br />Completed</div>
          </div>
        </div>

        <div className="study-stats">
          <h4>Study Statistic</h4>
          <div className="stats-bar">
            {/* Replace with chart component or mock bars */}
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
              <div className="bar-group" key={day}>
                <div className="bar learning"></div>
                <div className="bar challenge"></div>
              </div>
            ))}
          </div>
          <div className="stats-summary">
            <p>37 Total</p>
            <p>5 Avg</p>
            <p>18 Courses</p>
            <p>20 Challenges</p>
          </div>
        </div>

        <div className="agenda">
          <h4>Upcoming Agenda</h4>
          <div className="event">
            <p><strong>Presentation Skills Courses</strong><br />Chinthaka Kumara – 27 July, 7am–10am</p>
            <span>90 min | Event</span>
          </div>
          <div className="event">
            <p><strong>framework for beginners</strong><br />Dileepa Madushan – 28 July, 9am–11.30am</p>
            <span>120 min | Event</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Category;
