const express = require("express");
const router = express.Router();
const gradeController = require("../controllers/grade.controller");
const auth = require("../middleware/adminAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createGradeSchema,
  updateGradeSchema,
} = require("../middleware/validators/gradeValidator.middleware");

router.get("/", awaitHandlerFactory(gradeController.getAllGrades));
router.get("/id/:id", awaitHandlerFactory(gradeController.getGradeById));
router.post(
  "/",
  auth(),
  createGradeSchema,
  awaitHandlerFactory(gradeController.createGrade)
);
router.patch(
  "/id/:id",
  auth(),
  updateGradeSchema,
  awaitHandlerFactory(gradeController.updateGrade)
);
router.delete(
  "/id/:id",
  auth(),
  awaitHandlerFactory(gradeController.deleteGrade)
);

module.exports = router;
