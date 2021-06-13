const { body } = require("express-validator");

exports.createCourseSchema = [
  body("teacher_id").exists().withMessage("Teacher is required"),
  body("amount")
    .exists()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number"),
  body("course_name").exists().withMessage("Course name is required"),
];

exports.updateCourseSchema = [
  body("amount").optional(),
  body("course_name").optional(),
  body("description").optional(),
  body()
    .custom((value) => {
      return !!Object.keys(value).length;
    })
    .withMessage("Please provide required field to update")
    .custom((value) => {
      const updates = Object.keys(value);
      const allowUpdates = ["amount", "course_name", "description"];
      return updates.every((update) => allowUpdates.includes(update));
    })
    .withMessage("Invalid updates!"),
];
