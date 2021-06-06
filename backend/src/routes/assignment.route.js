const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignment.controller");
const auth = require("../middleware/adminAuth.middleware");
const studentAuth = require("../middleware/studentAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createAssignmentSchema,
  updateAssignmentSchema,
} = require("../middleware/validators/assignmentValidator.middleware");

router.get(
  "/",
  auth(),
  awaitHandlerFactory(assignmentController.getAllAssignments)
);
router.get(
  "/id/:id",
  auth(),
  awaitHandlerFactory(assignmentController.getAssignmentById)
);
router.get(
  "/myassignments/:teacherid",
  auth(),
  awaitHandlerFactory(assignmentController.getMyAssignments)
);
router.get(
  "/myassignments/:teacherid/course/:courseid",
  auth(),
  awaitHandlerFactory(assignmentController.getMyAssignmentsByCourse)
);
router.post(
  "/",
  auth(),
  createAssignmentSchema,
  awaitHandlerFactory(assignmentController.createAssignment)
);
router.patch(
  "/id/:id",
  auth(),
  updateAssignmentSchema,
  awaitHandlerFactory(assignmentController.updateAssignment)
);
router.delete(
  "/id/:id",
  auth(),
  awaitHandlerFactory(assignmentController.deleteAssignment)
);

// Student

router.get(
  "/getByStudentId/:studentId",
  studentAuth(),
  awaitHandlerFactory(assignmentController.getByStudentId)
);
module.exports = router;
