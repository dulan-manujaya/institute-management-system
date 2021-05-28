const { body } = require("express-validator");

exports.createGradeSchema = [
  body("grade_name").exists().withMessage("Grade Name is required"),
];

exports.updateGradeSchema = [
  body("grade_name").optional(),
  body()
    .custom((value) => {
      return !!Object.keys(value).length;
    })
    .withMessage("Please provide required field to update")
    .custom((value) => {
      const updates = Object.keys(value);
      const allowUpdates = ["grade_name"];
      return updates.every((update) => allowUpdates.includes(update));
    })
    .withMessage("Invalid updates!"),
];
