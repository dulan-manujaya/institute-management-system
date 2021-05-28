const { body } = require("express-validator");

exports.createAssignmentSchema = [
  body("course_id").exists().withMessage("Course is required"),
  body("title")
    .exists()
    .withMessage("Title is required")
    .notEmpty()
    .withMessage("Title can not be empty"),
  body("paper_url")
    .exists()
    .withMessage("Document is required")
    .notEmpty()
    .withMessage("Document can not be empty"),
  body("deadline").exists().withMessage("Deadline is required"),
];

exports.updateAssignmentSchema = [
  body("title").optional(),
  body("paper_url").optional(),
  body("deadline").optional(),
  body()
    .custom((value) => {
      return !!Object.keys(value).length;
    })
    .withMessage("Please provide required field to update")
    .custom((value) => {
      const updates = Object.keys(value);
      const allowUpdates = ["title", "paper_url", "deadline"];
      return updates.every((update) => allowUpdates.includes(update));
    })
    .withMessage("Invalid updates!"),
];
