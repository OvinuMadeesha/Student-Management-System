import React, { useState } from "react";
import '../../assets/styles/AdminHome.css';
import AdminDashboard from "./AdminDashboard"; 
import AdminCourse from "./AdminCourse";
import AdminStudent from "./AdminStudent";
import AdminModule from "./AdminModule";
import AdminPayment from "./AdminPayment";
import AdminResult from "./AdminResult"

const AdminHome = () => {
  const [selectedSection, setSelectedSection] = useState("Dashboard");

  const renderContent = () => {
    switch (selectedSection) {
      case "Dashboard":
        return <AdminDashboard/>;

      case "Course":
        return <AdminCourse/>;

      case "Students":
        return <AdminStudent/>;

      case "Payment":
        return <AdminPayment/>;
        
      case "Module":
        return <AdminModule/>;
        
      case "Results":
        return <AdminResult/>
      default:
        return <div>Select a section to display content.</div>;
    }
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="logo">Global Nation Academy</div>
        <nav className="nav-links">
          {["Dashboard", "Course", "Students", "Payment", "Module", "Results"].map(item => (
            <a
              key={item}
              href="#"
              className={selectedSection === item ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setSelectedSection(item);
              }}
            >
              {item}
            </a>
          ))}
          <a className="features-new" href="#">
            NEW+++ 
          </a>
        </nav>
      </aside>

      <main className="main-content">
        {renderContent()}
        <div className="support-btn">
          <button>Support</button>
        </div>
      </main>
    </div>
  );
};

export default AdminHome;
