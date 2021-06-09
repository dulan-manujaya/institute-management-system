const express = require("express");
const router = express.Router();
const resultController = require("../controllers/results.controller");
const adminAuth = require("../middleware/adminAuth.middleware");
const studentAuth = require("../middleware/studentAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createResult,
} = require("../middleware/validators/resultValidator.middleware");

router.get("/", awaitHandlerFactory(resultController.getAllReults));
router.get(
  "/exam/:examid",
  awaitHandlerFactory(resultController.getResultsByExam)
);
// router.get(
//   "/myexams/:teacherid",
//   auth(),
//   awaitHandlerFactory(resultController.getMyExams)
// );
router.post(
  "/",
  adminAuth(),
  createResult,
  awaitHandlerFactory(resultController.createResults)
);
// router.patch(
//   "/id/:id",
//   auth(),
//   updateExamchema,
//   awaitHandlerFactory(resultController.updateExam)
// );
router.delete(
  "/id/:id",
  adminAuth(),
  awaitHandlerFactory(resultController.deleteExam)
);

// Student

router.get(
  "/course/:courseid",
  awaitHandlerFactory(resultController.getMyExamsByCourse)
);

router.get(
  "/student/:studentid",
  studentAuth(),
  awaitHandlerFactory(resultController.getByStudentId)
);

// router.get(
//   "/getExamAnswerSubmissionsByStudentId/:studentId",
//   studentAuth(),
//   awaitHandlerFactory(resultController.getExamAnswerSubmissonsByStudentId)
// );

module.exports = router;
