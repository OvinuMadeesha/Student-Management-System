const Course = require("../models/Course");

// Post Course
exports.addCourse = async (req, res) => {
  try {
    const { name, payment } = req.body;
    const course = new Course({ name, payment });
    await course.save();
    res.status(201).json({ message: "Course added successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Error adding course", error });
  }
};

// Get Course
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
};

// Update Course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, payment } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { name, payment },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res
      .status(200)
      .json({ message: "Course updated successfully", updatedCourse });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
};

// Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
};

// Count all courses
exports.countCourses = async (req, res) => {
  try {
    const count = await Course.countDocuments();
    res.status(200).json({ totalCourses: count });
  } catch (error) {
    res.status(500).json({ message: "Error counting courses", error });
  }
};
