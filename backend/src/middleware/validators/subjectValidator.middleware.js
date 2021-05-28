const { body } = require("express-validator");

exports.createSubjectSchema = [
  body("subject_name").exists().withMessage("Subject Name is required"),
];

exports.updateSubjectSchema = [
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
