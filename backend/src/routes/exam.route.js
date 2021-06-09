const express = require("express");
const router = express.Router();
const examController = require("../controllers/exam.controller");
const adminAuth = require("../middleware/adminAuth.middleware");
const studentAuth = require("../middleware/studentAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createExamchema,
  createExamAnswerSubmissionSchema,
} = require("../middleware/validators/examValidator.middleware");

router.get("/", awaitHandlerFactory(examController.getAllExams));
router.get("/id/:id", awaitHandlerFactory(examController.getExamById));
// router.get(
//   "/myexams/:teacherid",
//   auth(),
//   awaitHandlerFactory(examController.getMyExams)
// );
router.post(
  "/",
  adminAuth(),
  createExamchema,
  awaitHandlerFactory(examController.createExam)
);
// router.patch(
//   "/id/:id",
//   auth(),
//   updateExamchema,
//   awaitHandlerFactory(examController.updateExam)
// );
router.delete(
  "/id/:id",
  adminAuth(),
  awaitHandlerFactory(examController.deleteExam)
);

// Student

router.get(
  "/course/:courseid",
  awaitHandlerFactory(examController.getMyExamsByCourse)
);

// router.get(
//   "/getExamAnswerSubmissionsByStudentId/:studentId",
//   studentAuth(),
//   awaitHandlerFactory(examController.getExamAnswerSubmissonsByStudentId)
// );

router.post(
  "/exam-answer-submission",
  studentAuth(),
  createExamAnswerSubmissionSchema,
  awaitHandlerFactory(examController.createExamAnswerSubmission)
);

module.exports = router;
