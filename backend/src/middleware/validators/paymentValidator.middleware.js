const { body } = require("express-validator");

exports.createPaymentSchema = [
  body("enrollment_id").exists().withMessage("Enrollment is required"),
  body("paid_for_month").exists().withMessage("Paid for month is required"),
  body("paid_for_year").exists().withMessage("Paid for year is required"),
];
