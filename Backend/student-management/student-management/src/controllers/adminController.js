const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Course = require('../models/Course'); // Import Course model

// create student
exports.createStudent = async (req, res) => {
  try {
    const {
      username,
      password,
      fullName,
      address,
      email,
      NIC,
      mobileNumber,
      parentName,
      course,
    } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const student = new User({
      username,
      password: hashed,
      role: "student",
      fullName,
      address,
      email,
      NIC,
      mobileNumber,
      parentName,
      image: req.file?.filename, // store file name
      course,
    });

    await student.save();
    res.status(201).json({ message: "Student created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password"); // Exclude passwords
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get students by course ID
exports.getStudentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const students = await User.find({ role: "student", course: courseId })
      .select("-password")
      .populate("course", "name"); // optional: populate course name

    res.status(200).json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching students by course" });
  }
};

// Count students by course ID
exports.countStudentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Count students in that course
    const count = await User.countDocuments({
      role: "student",
      course: courseId,
    });

    res.status(200).json({
      courseId,
      courseName: course.name, // assuming the field is 'name'
      studentCount: count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error counting students by course" });
  }
};

// update student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      password,
      fullName,
      address,
      email,
      NIC,
      mobileNumber,
      parentName,
      course,
    } = req.body;

    const updateData = {
      username,
      fullName,
      address,
      email,
      NIC,
      mobileNumber,
      parentName,
      course,
    };

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }

    if (req.file?.filename) {
      updateData.image = req.file.filename;
    }

    const updatedStudent = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student updated", student: updatedStudent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating student" });
  }
};

// delete student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await User.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting student" });
  }
};

// Count all students
exports.countAllStudents = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "student" });
    res.status(200).json({ totalStudents: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error counting all students" });
  }
};


// Get student count by course
exports.getCoursesWithStudentCounts = async (req, res) => {
  try {
    const results = await Course.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'course',
          as: 'students'
        }
      },
      {
        $addFields: {
          studentCount: {
            $size: {
              $filter: {
                input: '$students',
                as: 'student',
                cond: { $eq: ['$$student.role', 'student'] }
              }
            }
          }
        }
      },
      {
        $project: {
          name: 1,
          description: 1,
          studentCount: 1
        }
      }
    ]);

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch course student counts' });
  }
};