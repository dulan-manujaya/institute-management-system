const { body } = require("express-validator");

exports.createSubmissionSchema = [
  body("assignment_id").exists().withMessage("Assignment is required"),
  body("student_id").exists().withMessage("Student Id is required"),
  body("submission_url")
    .exists()
    .withMessage("Document is required")
    .notEmpty()
    .withMessage("Submission file can not be empty")
];

exports.updateSubmissionSchema = [
  body("assignment_id").optional(),
  body("submission_url").optional(),
  body("submitted_date").optional(),
  body()
    .custom((value) => {
      return !!Object.keys(value).length;
    })
    .withMessage("Please provide required field to update")
    .custom((value) => {
      const updates = Object.keys(value);
      const allowUpdates = [
        "assignment_id",
        "submission_url",
        "submitted_date",
      ];
      return updates.every((update) => allowUpdates.includes(update));
    })
    .withMessage("Invalid updates!"),
];
