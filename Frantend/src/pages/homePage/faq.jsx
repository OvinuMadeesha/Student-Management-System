// faq.jsx
import React from "react";
import '../../assets/styles/faq.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Faq = () => {
  return (
    <section id="faqs">

    
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2 className="logo">Global Nation Academy</h2>
          <p>
            Global Nation Academy aims to revolutionize the way educators and learners interact and
            engage in the digital learning environment
          </p>
          <div className="socials">
            <FaFacebookF />
            <FaTwitter />
            <FaInstagram />
            <FaLinkedinIn />
          </div>
        </div>

        <div className="footer-section links">
          <h4>Services</h4>
          <ul>
            <li>Email Marketing</li>
            <li>Campaigns</li>
            <li>Event</li>
            <li>Business</li>
          </ul>
        </div>

        <div className="footer-section links">
          <h4>About</h4>
          <ul>
            <li>Our Story</li>
            <li>Benefits</li>
            <li>Team</li>
            <li>Careers</li>
          </ul>
        </div>

        <div className="footer-section links">
          <h4>Help</h4>
          <ul>
            <li>FAQs</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-terms">
          <span>Privacy Policy</span>
          <span>Terms & Conditions</span>
          <span>Support</span>
        </div>
        <div className="footer-copy">
          © Global Nation Academy All Rights Reserved
        </div>
      </div>
    </footer>
    </section>
  );
};

export default Faq;
