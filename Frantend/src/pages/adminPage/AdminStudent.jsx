import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../../assets/styles/AdminStudent.css";
import axios from "axios";

const AdminStudent = () => {
  /* ────────────────────────────── STATE ────────────────────────────── */
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseMap, setCourseMap] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    course: "",
    nic: "",
    mobile: "",
    email: "",
    username: "",
    password: "",
    parentName: "",
    image: null,
  });

  /* ─────────────────────── FETCH STUDENTS ON MOUNT ─────────────────── */
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/students", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch students");
        }

        const data = await res.json();

        // Transform DB fields → UI fields
        const transformed = data.map((s) => ({
          id: s._id,
          fullName: s.fullName || "",
          address: s.address || "",
          course: s.course || "",
          nic: s.NIC || "",
          mobile: s.mobileNumber || "",
          email: s.email || "",
          username: s.username || "",
          password: "", // Never expose password
          parentName: s.parentName || "",
          image: s.image ? `http://localhost:5000/uploads/${s.image}` : null,
        }));

        setStudents(transformed);
      } catch (err) {
        console.error(err);
        alert(err.message || "Error loading students");
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        setCourseOptions(response.data);

        // Create a map of course ID to course name
        const courseIdNameMap = {};
        response.data.forEach((course) => {
          courseIdNameMap[course._id] = course.name;
        });
        setCourseMap(courseIdNameMap);

      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchStudents();
    fetchCourses();
  }, []);

  /* ───────────────────────────── HANDLERS ──────────────────────────── */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) =>
      name === "image"
        ? { ...prev, image: files[0] }
        : { ...prev, [name]: value }
    );
  };

  const handleAddOrEditStudent = async () => {
    const {
      fullName,
      address,
      course,
      nic,
      mobile,
      username,
      password,
      parentName,
      email,
    } = formData;

    if (
      !fullName ||
      !address ||
      !course ||
      !nic ||
      !mobile ||
      !username ||
      !password ||
      !parentName ||
      !email
    ) {
      alert("Please fill all required fields");
      return;
    }

    const token = localStorage.getItem("token");
    const body = new FormData();
    body.append("fullName", fullName);
    body.append("address", address);
    body.append("course", course);
    body.append("NIC", nic);
    body.append("mobileNumber", mobile);
    body.append("email", email);
    body.append("username", username);
    body.append("password", password);
    body.append("parentName", parentName);
    if (formData.image) body.append("image", formData.image);

    try {
      let res;
      let data;

      if (editingStudentId !== null) {
        // ---------- PUT (Update) ----------
        res = await fetch(
          `http://localhost:5000/api/admin/students/${editingStudentId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body,
          }
        );
        data = await res.json();

        if (!res.ok) throw new Error(data.message || "Update failed");

        alert("Student updated successfully");

        // Update the student in state
        setStudents((prev) =>
          prev.map((st) =>
            st.id === editingStudentId
              ? {
                  ...formData,
                  id: editingStudentId,
                  image:
                    formData.image instanceof File
                      ? URL.createObjectURL(formData.image)
                      : st.image,
                }
              : st
          )
        );
      } else {
        // ---------- POST (Create) ----------
        res = await fetch("http://localhost:5000/api/admin/create-student", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body,
        });
        data = await res.json();

        if (!res.ok) throw new Error(data.message || "Creation failed");

        alert("Student created successfully");

        setStudents((prev) => [
          ...prev,
          {
            id: data.student?._id || Date.now(),
            ...formData,
            image:
              formData.image instanceof File
                ? URL.createObjectURL(formData.image)
                : null,
          },
        ]);
      }

      resetForm();
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    }
  };

  const handleEdit = (student) => {
    setFormData({ ...student });
    setEditingStudentId(student.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/admin/students/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Delete failed");

      // Remove from UI
      setStudents((prev) => prev.filter((st) => st.id !== id));
      alert("Student deleted successfully");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error deleting student");
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      address: "",
      course: "",
      NIC: "",
      mobile: "",
      email: "",
      username: "",
      password: "",
      parentName: "",
      image: null,
    });
    setEditingStudentId(null);
    setShowModal(false);
  };

  /* ────────────────────── FILTERED LIST FOR SEARCH ─────────────────── */
  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ───────────────────────────── RENDER ────────────────────────────── */
  return (
    <div className="student-container">
      {/* Header + Search */}
      <div className="student-header">
        <h2>Students</h2>
        <div className="student-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, NIC or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="add-student-button"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            Add Student
          </button>
        </div>
      </div>

      {/* List */}
      <ul className="student-list">
        {filteredStudents.map((st) => (
          <li key={st.id} className="student-item">
            <div className="student-card">
              {st.image && (
                <img src={st.image} alt="student" className="student-img" />
              )}
              <div className="student-info">
                <strong>{st.fullName}</strong>
                <br />
                <small>
                  Course: {courseMap[st.course] || "Unknown Course"}
                </small>

                <br />
                <small>Mobile: {st.mobile}</small>
                <br />
                <small>Email: {st.email}</small>
              </div>
              <div className="student-actions">
                <FaEdit
                  onClick={() => handleEdit(st)}
                  className="action-icon edit"
                />
                <FaTrash
                  onClick={() => handleDelete(st.id)}
                  className="action-icon delete"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingStudentId ? "Edit Student" : "Add New Student"}</h3>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
            />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              placeholder="Parent Name"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
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
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              placeholder="NIC"
            />
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />

            <div className="modal-buttons">
              <button onClick={handleAddOrEditStudent} className="modal-button">
                {editingStudentId ? "Update" : "Add"}
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

export default AdminStudent;
