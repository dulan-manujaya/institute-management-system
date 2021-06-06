const { body } = require("express-validator");

exports.createAdminSchema = [
  body("first_name")
    .exists()
    .withMessage("Your first name is required")
    .isAlpha()
    .withMessage("Must be only alphabetical chars")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars long"),
  body("last_name")
    .exists()
    .withMessage("Your last name is required")
    .isAlpha()
    .withMessage("Must be only alphabetical chars")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars long"),
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
  body("mobile")
    .exists()
    .withMessage("Mobile is required")
    .isMobilePhone()
    .withMessage("Must be a valid mobile number")
    .trim(),
  body("password").exists().withMessage("Password is required").notEmpty(),
  body("confirm_password")
    .exists()
    .custom((value, { req }) => value === req.body.password)
    .withMessage(
      "confirm_password field must have the same value as the password field"
    ),
];

exports.updateAdminSchema = [
  body("first_name")
    .optional()
    .isAlpha()
    .withMessage("Must be only alphabetical chars")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars long"),
  body("last_name")
    .optional()
    .isAlpha()
    .withMessage("Must be only alphabetical chars")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars long"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
  body("mobile")
    .optional()
    .isMobilePhone()
    .withMessage("Must be a valid mobile number"),
  body("password")
    .optional()
    .notEmpty()
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
