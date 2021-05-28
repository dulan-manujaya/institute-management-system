const express = require("express");
const router = express.Router();
const forgotPasswordController = require("../controllers/forgot_password.controller");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

router.post(
  "/verifyEmail/",
  awaitHandlerFactory(forgotPasswordController.verifyEmail)
);
router.post(
  "/verifyOTP/",
  awaitHandlerFactory(forgotPasswordController.verifyOTP)
);
router.post(
  "/resetPassword/",
  awaitHandlerFactory(forgotPasswordController.resetPassword)
);
module.exports = router;
