const { body } = require("express-validator");

exports.createStudentSchema = [
  body("first_name")
    .exists()
    .withMessage("Your first name is required")
    .isAlpha()
    .withMessage("Must be only alphabetical chars"),
  body("last_name")
    .exists()
    .withMessage("Your last name is required")
    .isAlpha()
    .withMessage("Must be only alphabetical chars"),
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
  body("avatar").exists().withMessage("Profile Picture is required"),
  body("date_of_birth")
    .exists()
    .withMessage("Date of Birth is required")
    .isDate()
    .withMessage("Must be a valid date"),
  body("gender").exists().withMessage("Gender is required"),
  body("mobile")
    .exists()
    .withMessage("Mobile is required")
    .isMobilePhone()
    .withMessage("Must be a valid mobile number")
    .trim(),
  body("password")
    .exists()
    .withMessage("Password is required")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters"),
  body("confirm_password")
    .exists()
    .custom((value, { req }) => value === req.body.password)
    .withMessage(
      "confirm_password field must have the same value as the password field"
    ),
    body("guardian_mobile")
    .exists()
    .withMessage("Guardian mobile is required")
    .isMobilePhone()
    .withMessage("Must be a valid mobile number")
    .trim(),
    body("guardian_email")
    .exists()
    .withMessage("Guardian email is required")
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
];

exports.updateStudentSchema = [
  body("first_name")
    .optional()
    .isAlpha()
    .withMessage("Must be only alphabetical chars"),
  body("last_name")
    .optional()
    .isAlpha()
    .withMessage("Must be only alphabetical chars"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
  body("mobile")
    .optional()
    .isMobilePhone()
    .withMessage("Must be a valid mobile number"),
  body("avatar").optional(),
  body("grade_id").optional(),
  body("date_of_birth").optional().isDate().withMessage("Must be a valid date"),
  body("initial_login").optional(),
  body("gender").optional(),
  body("password")
    .optional()
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .custom((value, { req }) => !!req.body.confirm_password)
    .withMessage("Please confirm your password"),
  body("confirm_password")
    .optional()
    .custom((value, { req }) => value === req.body.password)
    .withMessage(
      "confirm_password field must have the same value as the password field"
    ),
  body()
    .custom((value) => {
      return !!Object.keys(value).length;
    })
    .withMessage("Please provide required field to update")
    .custom((value) => {
      const updates = Object.keys(value);
      const allowUpdates = [
        "password",
        "confirm_password",
        "email",
        "mobile",
        "first_name",
        "last_name",
        "grade_id",
        "date_of_birth",
        "avatar",
        "initial_login",
      ];
      return updates.every((update) => allowUpdates.includes(update));
    })
    .withMessage("Invalid updates!"),
];

exports.validateLogin = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
  body("password")
    .exists()
    .withMessage("Password is required")
    .notEmpty()
    .withMessage("Password must be filled"),
];
