const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submission.controller");
const auth = require("../middleware/auth.middleware");
const studentAuth = require("../middleware/studentAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createSubmissionSchema,
  updateSubmissionSchema,
} = require("../middleware/validators/submissionValidator.middleware");

router.get(
  "/teacher/:teacherid",
  auth(),
  awaitHandlerFactory(submissionController.getAllSubmissions)
);
router.get(
  "/assignment/:assignmentid/teacher/:teacherid",
  auth(),
  awaitHandlerFactory(submissionController.getAllSubmissionsByAssignment)
);
router.get(
  "/id/:id",
  awaitHandlerFactory(submissionController.getSubmissionById)
);
router.get(
  "/mysubmissions/:studentid",
  studentAuth(),
  awaitHandlerFactory(submissionController.getMySubmissions)
);
router.post(
  "/",
  studentAuth(),
  createSubmissionSchema,
  awaitHandlerFactory(submissionController.createSubmission)
);
router.patch(
  "/id/:id",
  auth(),
  updateSubmissionSchema,
  awaitHandlerFactory(submissionController.updateSubmission)
);
router.delete(
  "/id/:id",
  auth(),
  awaitHandlerFactory(submissionController.deleteSubmision)
);

module.exports = router;
