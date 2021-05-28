const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subject.controller");
const auth = require("../middleware/auth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createSubjectSchema,
  updateSubjectSchema,
} = require("../middleware/validators/subjectValidator.middleware");

router.get("/", awaitHandlerFactory(subjectController.getAllSubjects));
router.get("/id/:id", awaitHandlerFactory(subjectController.getSubjectById));
router.post(
  "/",
  auth(),
  createSubjectSchema,
  awaitHandlerFactory(subjectController.createSubject)
);
router.patch(
  "/id/:id",
  auth(),
  updateSubjectSchema,
  awaitHandlerFactory(subjectController.updateSubject)
);
router.delete(
  "/id/:id",
  auth(),
  awaitHandlerFactory(subjectController.deleteSubject)
);

module.exports = router;
