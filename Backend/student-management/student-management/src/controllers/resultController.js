const Result = require('../models/Results');
const User = require('../models/User');
const Module = require('../models/Module');

// Add or update a result
exports.addOrUpdateResult = async (req, res) => {
  try {
    const { studentId, moduleId, marks, remarks } = req.body;

    // Check if student and module exist
    const student = await User.findById(studentId);
    const module = await Module.findById(moduleId);

    if (!student || !module) {
      return res.status(404).json({ message: "Student or Module not found" });
    }

    // Grade calculation logic
    let grade;
    if (marks >= 90) grade = "A+";
    else if (marks >= 80) grade = "A";
    else if (marks >= 70) grade = "B+";
    else if (marks >= 60) grade = "B";
    else if (marks >= 50) grade = "C";
    else grade = "F";

    // Check if result already exists
    let result = await Result.findOne({ student: studentId, module: moduleId });

    if (result) {
      // Update existing result
      result.marks = marks;
      result.grade = grade;
      result.remarks = remarks;
      await result.save();
      return res.status(200).json({ message: "Result updated", result });
    }

    // Create new result
    result = new Result({
      student: studentId,
      module: moduleId,
      marks,
      grade,
      remarks
    });

    await result.save();
    res.status(201).json({ message: "Result added", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving result" });
  }
};


// Get all results for a student
exports.getResultsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const results = await Result.find({ student: studentId })
      .populate('module', 'moduleName')
      .populate('student', 'fullName');

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching results', error });
  }
};

exports.getAllResultsWithCourse = async (req, res) => {
  try {
    const results = await Result.find()
      .populate({
        path: "student",
        select: "fullName course",
        populate: {
          path: "course",
          select: "name", // Only course name if needed
        },
      })
      .populate("module", "moduleName");

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching results with course:", error);
    res.status(500).json({ message: "Error fetching results", error });
  }
};

//Delete result
exports.deleteResultById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Result.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.status(200).json({ message: "Result deleted", result });
  } catch (error) {
    console.error("Error deleting result:", error);
    res.status(500).json({ message: "Error deleting result", error });
  }
};

//Update result by Id
exports.updateResultById = async (req, res) => {
  try {
    const { id } = req.params;
    const { marks, remarks } = req.body;

    // Recalculate grade
    let grade;
    if (marks >= 90) grade = "A+";
    else if (marks >= 80) grade = "A";
    else if (marks >= 70) grade = "B+";
    else if (marks >= 60) grade = "B";
    else if (marks >= 50) grade = "C";
    else grade = "F";

    const updatedResult = await Result.findByIdAndUpdate(
      id,
      { marks, grade, remarks },
      { new: true }
    );

    if (!updatedResult) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.status(200).json({ message: "Result updated", result: updatedResult });
  } catch (error) {
    console.error("Error updating result:", error);
    res.status(500).json({ message: "Error updating result", error });
  }
};

