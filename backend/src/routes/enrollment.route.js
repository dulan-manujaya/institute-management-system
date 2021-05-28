const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollment.controller");
const auth = require("../middleware/auth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createEnrollmentSchema,
  updateEnrollmentSchema,
} = require("../middleware/validators/enrollmentValidator.middleware");

router.get(
  "/",
  auth(),
  awaitHandlerFactory(enrollmentController.getAllEnrollments)
);
// router.get(
//   "/grade/:id",
//   auth(),
//   awaitHandlerFactory(enrollmentController.getAllEnrollments)
// );
router.get(
  "/id/:id",
  auth(),
  awaitHandlerFactory(enrollmentController.getEnrollmentById)
);
router.get(
  "/teacher/:teacherid",
  auth(),
  awaitHandlerFactory(enrollmentController.getMyEnrollmentsTeacher)
);
router.get(
  "/student/:studentid",
  awaitHandlerFactory(enrollmentController.getMyEnrollmentsStudent)
);
router.get(
  "/coursedata/:courseid/teacher/:teacherid",
  auth(),
  awaitHandlerFactory(enrollmentController.getEnrollmentsGradeStudent)
);
router.get(
  "/coursedetails/:teacherid",
  auth(),
  awaitHandlerFactory(enrollmentController.getEnrollmentDetails)
);
router.get(
  "/pending/:teacherid",
  auth(),
  awaitHandlerFactory(enrollmentController.getMyPendingEnrollments)
);
router.get(
  "/approved/:teacherid",
  auth(),
  awaitHandlerFactory(enrollmentController.getMyApprovedEnrollments)
);
router.post(
  "/",
  createEnrollmentSchema,
  awaitHandlerFactory(enrollmentController.createEnrollment)
);

router.patch(
  "/id/:id",
  auth(),
  updateEnrollmentSchema,
  awaitHandlerFactory(enrollmentController.updateEnrollment)
);
router.delete(
  "/id/:id",
  auth(),
  awaitHandlerFactory(enrollmentController.deleteEnrollment)
);

module.exports = router;
