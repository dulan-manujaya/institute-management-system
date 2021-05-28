const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacher.controller");
const auth = require("../middleware/auth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createTeacherSchema,
  updateTeacherSchema,
  validateLogin,
} = require("../middleware/validators/teacherValidator.middleware");

router.get("/", auth(), awaitHandlerFactory(teacherController.getAllTeachers));
router.get(
  "/id/:id",
  auth(),
  awaitHandlerFactory(teacherController.getTeacherById)
);
router.get(
  "/email/:email",
  auth(),
  awaitHandlerFactory(teacherController.getTeacherByEmail)
);
router.get(
  "/whoami",
  auth(),
  awaitHandlerFactory(teacherController.getCurrentTeacher)
);
router.post(
  "/",
  createTeacherSchema,
  awaitHandlerFactory(teacherController.createTeacher)
);
router.patch(
  "/id/:id",
  auth(),
  updateTeacherSchema,
  awaitHandlerFactory(teacherController.updateTeacher)
);
router.delete(
  "/id/:id",
  auth(),
  awaitHandlerFactory(teacherController.deleteTeacher)
);

router.post(
  "/login",
  validateLogin,
  awaitHandlerFactory(teacherController.teacherLogin)
);

module.exports = router;
