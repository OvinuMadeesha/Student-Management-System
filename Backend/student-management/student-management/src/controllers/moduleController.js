const Module = require("../models/Module");
const User = require("../models/User");

// Add a module to a course

exports.addModule = async (req, res) => {
  try {
    const { courseId, moduleName } = req.body;
    const module = new Module({ courseId, moduleName });
    await module.save();
    res.status(201).json({ message: "Module added successfully", module });
  } catch (error) {
    res.status(500).json({ message: "Error adding module", error });
  }
};

// Get all modules

exports.getModules = async (req, res) => {
  try {
    const modules = await Module.find().populate("courseId", "name");
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching modules", error });
  }
};

// Get modules by course

exports.getModulesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const modules = await Module.find({ courseId });
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course modules", error });
  }
};

// Update a module

exports.updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { moduleName } = req.body;

    const updated = await Module.findByIdAndUpdate(
      id,
      { moduleName },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.status(200).json({ message: "Module updated", updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating module", error });
  }
};

// Delete a module

exports.deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Module.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.status(200).json({ message: "Module deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting module", error });
  }
};


// Get modules by student ID

exports.getModulesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get the student and their course
    
    const student = await User.findById(studentId).populate("course");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find all modules related to the student's course
    const modules = await Module.find({ courseId: student.course._id });

    res.status(200).json({
      student: student.fullName,
      course: student.course.name,
      modules,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching student's modules" });
  }
};
