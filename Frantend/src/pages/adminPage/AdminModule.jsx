import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../../assets/styles/AdminModule.css";
import axios from "axios";

const AdminModule = () => {
  const [modules, setModules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ course: "", moduleName: "" });
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseOptions, setCourseOptions] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        setCourseOptions(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchModules = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/modules");
        const modulesWithCourseName = response.data.map((module) => ({
          ...module,
          courseName: module.courseId?.name || "", // Extract course name
        }));
        setModules(modulesWithCourseName);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchCourses();
    fetchModules();
  }, []);

  const filteredModules = modules.filter(
    (module) =>
      module.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.courseName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrEditModule = async () => {
    if (formData.course && formData.moduleName) {
      try {
        if (editingModuleId !== null) {
          //  Send PUT request to update module in backend
          const response = await axios.put(
            `http://localhost:5000/api/modules/${editingModuleId}`,
            {
              courseId: formData.course,
              moduleName: formData.moduleName,
            }
          );

          const updatedModule = response.data.updated;
          const course = courseOptions.find((c) => c._id === formData.course);
          updatedModule.courseName = course?.name || "";

          setModules((prevModules) =>
            prevModules.map((module) =>
              module._id === editingModuleId
                ? {
                    ...module,
                    moduleName: formData.moduleName,
                    courseName:
                      courseOptions.find((c) => c._id === formData.course)
                        ?.name || "",
                  }
                : module
            )
          );
        } else {
          const response = await axios.post(
            "http://localhost:5000/api/modules",
            {
              courseId: formData.course,
              moduleName: formData.moduleName,
            }
          );

          const newModule = response.data.module;
          const course = courseOptions.find((c) => c._id === formData.course);
          newModule.courseName = course?.name || "";

          setModules((prevModules) => [...prevModules, newModule]);
        }

        resetForm();
      } catch (error) {
        console.error("Error saving module:", error);
        alert("Failed to save module");
      }
    }
  };

  const handleEdit = (module) => {
    setFormData({
      course: module.courseId._id || module.courseId,
      moduleName: module.moduleName,
    });
    setEditingModuleId(module._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this module?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/modules/${id}`);
      setModules((prevModules) =>
        prevModules.filter((module) => module._id !== id)
      );
    } catch (error) {
      console.error("Error deleting module:", error);
      alert("Failed to delete module");
    }
  };

  const resetForm = () => {
    setFormData({ course: "", moduleName: "" });
    setEditingModuleId(null);
    setShowModal(false);
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>Modules</h2>
        <div className="module-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="add-module-button"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            Add Module
          </button>
        </div>
      </div>

      <p>Here you can manage module details associated with courses.</p>

      <ul className="module-list">
        {filteredModules.map((module) => (
          <li key={module._id} className="module-item">
            <div className="module-info">
              <strong>{module.moduleName}</strong>
              <br />
              <small>Course: {module.courseName}</small>
            </div>
            <div className="module-actions">
              <FaEdit
                onClick={() => handleEdit(module)}
                className="action-icon edit"
              />
              <FaTrash
                onClick={() => handleDelete(module._id)}
                className="action-icon delete"
              />
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingModuleId ? "Edit Module" : "Add New Module"}</h3>

            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
            >
              <option value="">Select Course</option>
              {courseOptions.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="moduleName"
              value={formData.moduleName}
              onChange={handleChange}
              placeholder="Module Name"
            />

            <div className="modal-buttons">
              <button onClick={handleAddOrEditModule} className="modal-button">
                {editingModuleId ? "Update" : "Add"}
              </button>
              <button onClick={resetForm} className="modal-button cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminModule;
