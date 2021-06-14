const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance.controller");
const adminAuth = require("../middleware/adminAuth.middleware");
const teacherAuth = require("../middleware/teacherAuth.middleware");
const parentAuth = require("../middleware/parentAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createAttendanceSchema,
  createTeacherAttendanceSchema,
} = require("../middleware/validators/attendanceValidator.middleware");

router.get("/", awaitHandlerFactory(attendanceController.getAllAttendance));
router.post(
  "/teacher/dates",
  adminAuth(),
  awaitHandlerFactory(attendanceController.getTeacherAttendanceByDates)
);
router.post(
  "/dates",
  adminAuth(),
  awaitHandlerFactory(attendanceController.getStudentAttendanceByDates)
);
router.get(
  "/course/:id",
  awaitHandlerFactory(attendanceController.getAttendanceByCourse)
);
router.get(
  "/student/:id",
  awaitHandlerFactory(attendanceController.getAttendanceByStudent)
);
router.get(
  "/date/:date",
  awaitHandlerFactory(attendanceController.getAttendanceByDate)
);
router.post(
  "/",
  adminAuth(),
  createAttendanceSchema,
  awaitHandlerFactory(attendanceController.createAttendance)
);
router.post(
  "/teacher",
  adminAuth(),
  createTeacherAttendanceSchema,
  awaitHandlerFactory(attendanceController.createTeacherAttendance)
);
// router.patch(
//   "/id/:id",
//   adminAuth(),
//   updateCourseSchema,
//   awaitHandlerFactory(attendanceController.updateCourse)
// );
router.delete(
  "/id/:id",
  adminAuth(),
  awaitHandlerFactory(attendanceController.deleteCourse)
);

// Teacher

router.post(
  "/teacher/StudentAttendance/:teacherid",
  teacherAuth(),
  awaitHandlerFactory(attendanceController.getStudentAttendanceByTeacherId)
);

// Parent

router.post(
  "/parent/StudentAttendance/:parentid",
  parentAuth(),
  awaitHandlerFactory(attendanceController.getStudentAttendanceByParentId)
);

module.exports = router;
