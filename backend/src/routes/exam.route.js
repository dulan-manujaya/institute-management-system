const express = require("express");
const router = express.Router();
const examController = require("../controllers/exam.controller");
const adminAuth = require("../middleware/adminAuth.middleware");
const studentAuth = require("../middleware/studentAuth.middleware");
const teacherAuth = require("../middleware/teacherAuth.middleware");
const parentAuth = require("../middleware/parentAuth.middleware");
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

router.get(
  "/student/:studentId",
  studentAuth(),
  awaitHandlerFactory(examController.getByStudentId)
);

//Parent

router.get(
  "/parent/:parentId",
  parentAuth(),
  awaitHandlerFactory(examController.getByParentId)
);

//Teacher

router.get(
  "/teacher/:teacherId",
  teacherAuth(),
  awaitHandlerFactory(examController.getByTeacherId)
);
module.exports = router;
