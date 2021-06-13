const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance.controller");
const adminAuth = require("../middleware/adminAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createAttendanceSchema,
  createTeacherAttendanceSchema,
} = require("../middleware/validators/attendanceValidator.middleware");

router.get("/", awaitHandlerFactory(attendanceController.getAllAttendance));
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

module.exports = router;
