const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");
const studentAuth = require("../middleware/studentAuth.middleware");
const adminAuth = require("../middleware/adminAuth.middleware");
const teacherAuth = require("../middleware/teacherAuth.middleware");
const parentAuth = require("../middleware/parentAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createStudentSchema,
  updateStudentSchema,
  validateLogin,
} = require("../middleware/validators/studentValidator.middleware");

router.get("/", awaitHandlerFactory(studentController.getAllStudents));
// router.get(
//   "/all",
//   adminAuth(),
//   awaitHandlerFactory(studentController.getAllStudentsWithGrade)
// );
router.get(
  "/last",
  awaitHandlerFactory(studentController.getLastStudent)
);
router.get(
  "/course/:courseid",
  awaitHandlerFactory(studentController.getStudentsByCourse)
);
router.get("/id/:id", awaitHandlerFactory(studentController.getStudentById));
// router.get(
//   "/adminAuthid/:adminAuthid",
//   awaitHandlerFactory(studentController.getStudentByAuthId)
// );
router.get(
  "/email/:email",
  awaitHandlerFactory(studentController.getStudentByEmail)
);
router.get(
  "/whoami",
  studentAuth(),
  awaitHandlerFactory(studentController.getCurrentStudent)
);
router.post(
  "/",
  createStudentSchema,
  awaitHandlerFactory(studentController.createStudent)
);
router.patch(
  "/id/:id",
  adminAuth(),
  updateStudentSchema,
  awaitHandlerFactory(studentController.updateStudent)
);
router.delete(
  "/id/:id",
  adminAuth(),
  awaitHandlerFactory(studentController.deleteStudent)
);

router.post(
  "/login",
  validateLogin,
  awaitHandlerFactory(studentController.studentLogin)
);

//Teacher

router.get(
  "/getByTeacherId/:teacherId",
  teacherAuth(),
  awaitHandlerFactory(studentController.getByTeacherId)
);

//Parent

router.get(
  "/getByParentId/:parentId",
  parentAuth(),
  awaitHandlerFactory(studentController.getByParentId)
);
module.exports = router;
