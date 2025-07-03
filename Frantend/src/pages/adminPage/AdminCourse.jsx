import { FaEdit, FaTrash } from "react-icons/fa";
import "../../assets/styles/AdminCourse.css";
import React, { useEffect, useState } from "react";

const AdminCourse = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [editingCourseId, setEditingCourseId] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCourses(
            data.map((course) => ({
              id: course._id,
              name: course.name,
              price: course.payment,
            }))
          );
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleAddOrEditCourse = async () => {
    if (courseName.trim() && coursePrice) {
      const token = localStorage.getItem("token");

      if (editingCourseId !== null) {
        // PUT request to update existing course
        try {
          const response = await fetch(
            `http://localhost:5000/api/courses/${editingCourseId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ name: courseName, payment: coursePrice }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            setCourses(
              courses.map((course) =>
                course.id === editingCourseId
                  ? {
                      id: data.updatedCourse._id,
                      name: data.updatedCourse.name,
                      price: data.updatedCourse.payment,
                    }
                  : course
              )
            );
          } else {
            console.error("Failed to update course");
          }
        } catch (error) {
          console.error("Error updating course:", error);
        }
      } else {
        // POST request to add new course
        try {
          const response = await fetch("http://localhost:5000/api/courses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: courseName, payment: coursePrice }),
          });

          if (response.ok) {
            const data = await response.json();
            setCourses([
              ...courses,
              {
                id: data.course._id,
                name: data.course.name,
                price: data.course.payment,
              },
            ]);
          } else {
            console.error("Failed to add course");
          }
        } catch (error) {
          console.error("Error adding course:", error);
        }
      }

      setCourseName("");
      setCoursePrice("");
      setEditingCourseId(null);
      setShowModal(false);
    }
  };

  const handleEdit = (course) => {
    setCourseName(course.name);
    setCoursePrice(course.price);
    setEditingCourseId(course.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCourses(courses.filter((course) => course.id !== id));
      } else {
        console.error("Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="course-container">
      <div className="course-header">
        <h2>Courses</h2>
        <div className="course-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="add-course-button"
            onClick={() => {
              setShowModal(true);
              setEditingCourseId(null);
              setCourseName("");
              setCoursePrice("");
            }}
          >
            Add Course
          </button>
        </div>
      </div>
      <p>Here you can manage your course details.</p>

      <ul className="course-list scrollable-list">
        {filteredCourses.map((course) => (
          <li key={course.id} className="course-item">
            <span>
              <h2>{course.name}</h2> Rs{course.price}
            </span>
            <div className="course-actions">
              <FaEdit
                onClick={() => handleEdit(course)}
                className="action-icon edit"
              />
              <FaTrash
                onClick={() => handleDelete(course.id)}
                className="action-icon delete"
              />
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingCourseId ? "Edit Course" : "Add New Course"}</h3>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Course Name"
            />
            <input
              type="number"
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
              placeholder="Course Price"
            />
            <div className="modal-buttons">
              <button onClick={handleAddOrEditCourse} className="modal-button">
                {editingCourseId ? "Update" : "Add"}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setCourseName("");
                  setCoursePrice("");
                  setEditingCourseId(null);
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

export default AdminCourse;
