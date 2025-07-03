import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/Module.css";

const Module = ({ onClose }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const studentId = localStorage.getItem("studentId"); // Example: store after login
        console.log("Student ID:", studentId);
        const response = await axios.get(
          `http://localhost:5000/api/modules/student/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${ token }`,
            },
          }
        );
        setModules(response.data.modules);
      } catch (err) {
        setError("Failed to load modules");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  return (
    <div className="module-overlay">
      <div className="module-popup">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>My Modules</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul>
            {modules.map((mod, index) => (
              <li key={index}>{mod.moduleName}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Module;
