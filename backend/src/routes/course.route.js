const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const adminAuth = require("../middleware/adminAuth.middleware");
const studentadminAuth = require("../middleware/studentAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createCourseSchema,
  updateCourseSchema,
} = require("../middleware/validators/courseValidator.middleware");

router.get("/", awaitHandlerFactory(courseController.getAllCourses));
router.get(
  "/mycourses/:teacherid",
  awaitHandlerFactory(courseController.getMyCourses)
);
router.get(
  "/mycourses/:teacherid/grade/:gradeid",
  awaitHandlerFactory(courseController.getMyCoursesByGrade)
);
router.get("/id/:id", awaitHandlerFactory(courseController.getCourseById));
router.get(
  "/grade/:id",
  awaitHandlerFactory(courseController.getCourseByGrade)
);
router.post(
  "/",
  adminAuth(),
  createCourseSchema,
  awaitHandlerFactory(courseController.createCourse)
);
router.patch(
  "/id/:id",
  adminAuth(),
  updateCourseSchema,
  awaitHandlerFactory(courseController.updateCourse)
);
router.delete(
  "/id/:id",
  adminAuth(),
  awaitHandlerFactory(courseController.deleteCourse)
);

// Student

router.get(
  "/getByStudentId/:studentId",
  studentadminAuth(),
  awaitHandlerFactory(courseController.getByStudentId)
);

module.exports = router;
