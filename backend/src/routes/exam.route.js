const express = require("express");
const router = express.Router();
const examController = require("../controllers/exam.controller");
const auth = require("../middleware/adminAuth.middleware");
const studentAuth = require("../middleware/studentAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createExamchema,
  updateExamchema,
  createExamAnswerSubmissionSchema,
} = require("../middleware/validators/examValidator.middleware");

router.get("/", auth(), awaitHandlerFactory(examController.getAllExams));
router.get("/id/:id", auth(), awaitHandlerFactory(examController.getExamById));
router.get(
  "/myexams/:teacherid",
  auth(),
  awaitHandlerFactory(examController.getMyExams)
);
router.post(
  "/",
  auth(),
  createExamchema,
  awaitHandlerFactory(examController.creatExam)
);
router.patch(
  "/id/:id",
  auth(),
  updateExamchema,
  awaitHandlerFactory(examController.updateExam)
);
router.delete(
  "/id/:id",
  auth(),
  awaitHandlerFactory(examController.deleteExam)
);

// Student

router.get(
  "/getByStudentId/:studentId",
  studentAuth(),
  awaitHandlerFactory(examController.getByStudentId)
);

router.get(
  "/getExamAnswerSubmissionsByStudentId/:studentId",
  studentAuth(),
  awaitHandlerFactory(examController.getExamAnswerSubmissonsByStudentId)
);

router.post(
  "/exam-answer-submission",
  studentAuth(),
  createExamAnswerSubmissionSchema,
  awaitHandlerFactory(examController.createExamAnswerSubmission)
);

module.exports = router;
