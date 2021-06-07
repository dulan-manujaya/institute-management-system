const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacher.controller");
const adminAuth = require("../middleware/adminAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createTeacherSchema,
  updateTeacherSchema,
  validateLogin,
} = require("../middleware/validators/teacherValidator.middleware");

router.get(
  "/",
  awaitHandlerFactory(teacherController.getAllTeachers)
);
router.get(
  "/id/:id",
  awaitHandlerFactory(teacherController.getTeacherById)
);
router.get(
  "/email/:email",
  adminAuth(),
  awaitHandlerFactory(teacherController.getTeacherByEmail)
);
router.get(
  "/whoami",
  adminAuth(),
  awaitHandlerFactory(teacherController.getCurrentTeacher)
);
router.post(
  "/",
  adminAuth(),
  createTeacherSchema,
  awaitHandlerFactory(teacherController.createTeacher)
);
router.patch(
  "/id/:id",
  adminAuth(),
  updateTeacherSchema,
  awaitHandlerFactory(teacherController.updateTeacher)
);
router.delete(
  "/id/:id",
  adminAuth(),
  awaitHandlerFactory(teacherController.deleteTeacher)
);

router.post(
  "/login",
  validateLogin,
  awaitHandlerFactory(teacherController.teacherLogin)
);

module.exports = router;
