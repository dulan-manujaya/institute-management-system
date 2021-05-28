const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");
const studentAuth = require("../middleware/studentAuth.middleware");
const auth = require("../middleware/auth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createStudentSchema,
  updateStudentSchema,
  validateLogin,
} = require("../middleware/validators/studentValidator.middleware");

router.get("/", auth(), awaitHandlerFactory(studentController.getAllStudents));
router.get(
  "/all",
  auth(),
  awaitHandlerFactory(studentController.getAllStudentsWithGrade)
);
router.get(
  "/last",
  auth(),
  awaitHandlerFactory(studentController.getLastStudent)
);
router.get(
  "/course/:courseid",
  auth(),
  awaitHandlerFactory(studentController.getStudentsByCourse)
);
router.get("/id/:id", awaitHandlerFactory(studentController.getStudentById));
router.get(
  "/authid/:authid",
  awaitHandlerFactory(studentController.getStudentByAuthId)
);
router.get(
  "/email/:email",
  studentAuth(),
  awaitHandlerFactory(studentController.getStudentByEmail)
);
router.get(
  "/whoami",
  studentAuth(),
  awaitHandlerFactory(studentController.getCurrentStudent)
);
router.post(
  "/",
  auth(),
  createStudentSchema,
  awaitHandlerFactory(studentController.createStudent)
);
router.patch(
  "/id/:id",
  auth(),
  updateStudentSchema,
  awaitHandlerFactory(studentController.updateStudent)
);
router.delete(
  "/id/:id",
  auth(),
  awaitHandlerFactory(studentController.deleteStudent)
);

router.post(
  "/login",
  validateLogin,
  awaitHandlerFactory(studentController.studentLogin)
);
module.exports = router;
