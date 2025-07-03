import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../../assets/styles/AdminResults.css";

const AdminResult = () => {
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [marks, setMarks] = useState("");
  const [editingResultId, setEditingResultId] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchResults();
    fetchStudents();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchStudents(searchQuery);
      } else {
        fetchStudents();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch students");
      setStudents(await res.json());
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const searchStudents = async (query) => {
    try {
      setIsSearching(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/admin/students?search=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to search students");
      setStudents(await res.json());
    } catch (err) {
      console.error("Error searching students:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/results", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch results");
      setResults(await res.json());
    } catch (err) {
      console.error("Error fetching results:", err);
    }
  };

  const fetchModules = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/modules/student/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch modules");
      const data = await res.json();
      setModules(data.modules || []);
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };

  const handleAddOrEditResult = async () => {
    if (!studentName || !moduleName || !marks || !remarks) {
      return alert("Please fill in all required fields.");
    }

    try {
      const token = localStorage.getItem("token");
      const url = editingResultId
        ? `http://localhost:5000/api/results/${editingResultId}`
        : "http://localhost:5000/api/results";
      const method = editingResultId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: studentName,
          moduleId: moduleName,
          marks: parseInt(marks),
          remarks,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save result.");
      }

      alert(`Result ${editingResultId ? "updated" : "added"} successfully!`);
      setShowModal(false);
      resetForm();
      fetchResults(); // Refresh the results list
    } catch (err) {
      console.error("Error saving result:", err);
      alert(err.message);
    }
  };

  const handleEdit = (result) => {
    setStudentName(result.student._id);
    fetchModules(result.student._id);
    setModuleName(result.module._id);
    setMarks(result.marks);
    setRemarks(result.remarks);
    setEditingResultId(result._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/results/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete result");
      setResults(results.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting result:", err);
      alert("Failed to delete result.");
    }
  };

  const resetForm = () => {
    setStudentName("");
    setModuleName("");
    setMarks("");
    setRemarks("");
    setEditingResultId(null);
  };

  const filteredResults = results.filter((res) =>
    res.student?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="course-container">
      <div className="course-header">
        <h2>Results</h2>
        <div className="course-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="add-course-button"
            onClick={() => setShowModal(true)}
          >
            Add Result
          </button>
        </div>
      </div>
      <p>Here you can manage result details.</p>

      <ul className="course-list scrollable-list">
        {filteredResults.map((res) => (
          <li key={res._id} className="course-item">
            <span>
              <h3>Student: {res.student?.fullName || "Unknown"}</h3>
              <p>Course: {res.student?.course?.name || "N/A"}</p>
              <p>Module: {res.module?.moduleName || "N/A"}</p>
              <p>Marks: {res.marks}</p>
              <p>Grade: {res.grade}</p>
              <p>Remarks: {res.remarks}</p>
            </span>
            <div className="course-actions">
              <FaEdit
                onClick={() => handleEdit(res)}
                className="action-icon edit"
              />
              <FaTrash
                onClick={() => handleDelete(res._id)}
                className="action-icon delete"
              />
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingResultId ? "Edit Result" : "Add New Result"}</h3>

            <select
              value={studentName}
              onChange={(e) => {
                const selectedId = e.target.value;
                setStudentName(selectedId);
                fetchModules(selectedId);
              }}
              disabled={isSearching}
            >
              <option value="">Select Student</option>
              {isSearching ? (
                <option disabled>Searching...</option>
              ) : (
                students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.fullName}
                  </option>
                ))
              )}
            </select>

            <select
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              disabled={!studentName}
            >
              <option value="">Select Module</option>
              {modules.length > 0 ? (
                modules.map((mod) => (
                  <option key={mod._id} value={mod._id}>
                    {mod.moduleName}
                  </option>
                ))
              ) : (
                <option disabled>
                  {studentName ? "No modules found" : "Select student first"}
                </option>
              )}
            </select>

            <input
              type="number"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              placeholder="Marks"
              min="0"
              max="100"
            />

            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Remarks"
              rows="3"
            />

            <div className="modal-buttons">
              <button onClick={handleAddOrEditResult} className="modal-button">
                {editingResultId ? "Update" : "Add"}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="modal-button cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResult;