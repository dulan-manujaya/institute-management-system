const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const auth = require("../middleware/adminAuth.middleware");
const studentAuth = require("../middleware/studentAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createPaymentSchema,
} = require("../middleware/validators/paymentValidator.middleware");

router.get("/", awaitHandlerFactory(paymentController.getAllPayments));
router.get("/id/:id", awaitHandlerFactory(paymentController.getPaymentById));
router.post(
  "/",
  studentAuth(),
  createPaymentSchema,
  awaitHandlerFactory(paymentController.createPayment)
);
router.delete(
  "/id/:id",
  auth(),
  awaitHandlerFactory(paymentController.deletePayment)
);

// Student

router.get(
  "/getByStudentId/:studentId",
  studentAuth(),
  awaitHandlerFactory(paymentController.getByStudentId)
);

router.post(
  "/getLatestPaymentDate/",
  studentAuth(),
  awaitHandlerFactory(paymentController.getLatestPaymentDate)
);

module.exports = router;
