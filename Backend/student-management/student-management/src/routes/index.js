const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");
const upload = require("../middlewares/upload");
const courseController = require("../controllers/courseController");
const moduleController = require("../controllers/moduleController");
const paymentController = require("../controllers/paymentController");
const resultController = require("../controllers/resultController");

// Public route
router.post("/login", authController.login);

// Admin route (token required)
router.post(
  "/admin/create-student",
  auth,
  upload.single("image"), // Handle file upload
  adminController.createStudent
);

// Get student
router.get("/admin/students", auth, adminController.getAllStudents);

// Get students by course ID
router.get(
  "/admin/students/course/:courseId",
  auth,
  adminController.getStudentsByCourse
);

// Count students by course ID
router.get(
  "/admin/students/course/:courseId/count",
  auth,
  adminController.countStudentsByCourse
);

router.get(
  "/admin/students/courses/count",
  auth,
  adminController.getCoursesWithStudentCounts
);

router.put(
  "/admin/students/:id",
  upload.single("image"),
  adminController.updateStudent
);

router.delete("/admin/students/:id", adminController.deleteStudent);

// Get all student count
router.get("/students/count", adminController.countAllStudents);


// Post Course
router.post("/courses", courseController.addCourse);

// Get Course
router.get("/courses", courseController.getCourses);

// Put Course
router.put("/courses/:id", courseController.updateCourse);

// Delete Course
router.delete("/courses/:id", courseController.deleteCourse);

// Count of all courses
router.get("/courses/count", courseController.countCourses);



// Module routes
router.post("/modules", moduleController.addModule); // Add module

router.get("/modules", moduleController.getModules); // Get all

router.get("/modules/:courseId", moduleController.getModulesByCourse); // Get by course

router.put("/modules/:id", moduleController.updateModule); // Update

router.delete("/modules/:id", moduleController.deleteModule); // Delete

router.get(
  "/modules/student/:studentId",
  auth,
  moduleController.getModulesByStudent
); // Get the modules by student Id

// Add payment (admin only)
router.post("/payments", auth, paymentController.addPayment);

// Get all payments (admin)
router.get("/payments", auth, paymentController.getAllPayments);

// Get payments by student ID (admin or self)
router.get(
  "/payments/student/:studentId",
  auth,
  paymentController.getPaymentsByStudent
);

router.put("/payments/:id", paymentController.updatePayment);

router.delete("/payments/:id", paymentController.deletePayment);

// Add or update student result
router.post("/results", auth, resultController.addOrUpdateResult);

// Get all results by student
router.get(
  "/results/student/:studentId",
  auth,
  resultController.getResultsByStudent
);

// Get all results with student's course
router.get("/results", resultController.getAllResultsWithCourse);

// Get results by student ID
router.get("/results/:studentId", resultController.getResultsByStudent);

// Update result by ID
router.put("/results/:id", resultController.updateResultById);

// Delete result by ID
router.delete("/results/:id", resultController.deleteResultById);

module.exports = router;
