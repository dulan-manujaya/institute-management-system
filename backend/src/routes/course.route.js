const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const auth = require("../middleware/auth.middleware");
const studentAuth = require("../middleware/studentAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createCourseSchema,
  updateCourseSchema,
} = require("../middleware/validators/courseValidator.middleware");

router.get("/", awaitHandlerFactory(courseController.getAllCourses));
router.get(
  "/mycourses/:teacherid",
  auth(),
  awaitHandlerFactory(courseController.getMyCourses)
);
router.get(
  "/mycourses/:teacherid/grade/:gradeid",
  auth(),
  awaitHandlerFactory(courseController.getMyCoursesByGrade)
);
router.get("/id/:id", awaitHandlerFactory(courseController.getCourseById));
router.get(
  "/grade/:id",
  awaitHandlerFactory(courseController.getCourseByGrade)
);
router.post(
  "/",
  auth(),
  createCourseSchema,
  awaitHandlerFactory(courseController.createCourse)
);
router.patch(
  "/id/:id",
  auth(),
  updateCourseSchema,
  awaitHandlerFactory(courseController.updateCourse)
);
router.delete(
  "/id/:id",
  auth(),
  awaitHandlerFactory(courseController.deleteCourse)
);

// Student

router.get(
  "/getByStudentId/:studentId",
  studentAuth(),
  awaitHandlerFactory(courseController.getByStudentId)
);

module.exports = router;
