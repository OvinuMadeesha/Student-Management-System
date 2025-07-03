import React, { useEffect, useState } from "react";
import "../../assets/styles/AdminDashboard.css";
import { FaUserGraduate, FaChalkboardTeacher, FaUserTie } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AdminDashboard = () => {
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [courseStudentData, setCourseStudentData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCourseCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses/count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setTotalCourses(data.totalCourses);
      } catch (error) {
        console.error("Error fetching course count:", error);
      }
    };

    const fetchStudentCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/students/count");
        const data = await response.json();
        setTotalStudents(data.totalStudents);
      } catch (error) {
        console.error("Error fetching student count:", error);
      }
    };

    const fetchCourseStudentCounts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/students/courses/count",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setCourseStudentData(data.slice(0, 7)); // limit to max 7 courses
      } catch (error) {
        console.error("Error fetching course student count:", error);
      }
    };

    fetchCourseCount();
    fetchStudentCount();
    fetchCourseStudentCounts();
  }, []);

  return (
    <>
      <div className="dashboard-cards-container">
        <div className="dashboard-card orange">
          <div className="card-content">
            <h2>{totalStudents}</h2>
            <p>Students</p>
          </div>
          <FaUserGraduate className="card-icon" />
        </div>

        <div className="dashboard-card purple">
          <div className="card-content">
            <h2>{totalCourses}</h2>
            <p>Courses</p>
          </div>
          <FaChalkboardTeacher className="card-icon" />
        </div>

        <div className="dashboard-card blue">
          <div className="card-content">
            <h2>1</h2>
            <p>Administrators</p>
          </div>
          <FaUserTie className="card-icon" />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bar-chart-container">
        <h3>Student Count per Course</h3>
        <ResponsiveContainer width="95%" height={250}>
          <BarChart data={courseStudentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="studentCount" fill="#6a5acd" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default AdminDashboard;
