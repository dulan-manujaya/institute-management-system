const { body } = require("express-validator");

exports.createExamchema = [
  body("course_id").exists().withMessage("Course is required"),
  body("exam_title")
    .exists()
    .withMessage("Exam Title is required")
    .notEmpty()
    .withMessage("Exam Title can not be empty"),
  body("exam_date")
    .exists()
    .withMessage("Exam date is required")
    .notEmpty()
    .withMessage("Exam date can not be empty")
    .isDate()
    .withMessage("Exam date must be a valid date"),
  body("exam_start_time")
    .exists()
    .withMessage("Exam start time is required")
    .notEmpty()
    .withMessage("Exam start time cannot be empty"),
  body("exam_end_time")
    .exists()
    .withMessage("Exam end time is required")
    .notEmpty()
    .withMessage("Exam end time cannot be empty"),
  body("exam_duration")
    .exists("Exam duration is required")
    .notEmpty()
    .withMessage("Exam duration cannot be empty"),
  body("paper_url")
    .exists()
    .withMessage("Exam paper is required")
    .notEmpty()
    .withMessage("Exam paper can not be empty"),
];

exports.updateExamchema = [
  body("exam_start_time").optional(),
  body("exam_end_time").optional(),
  body("exam_date").optional(),
  body("paper_url").optional(),
  body()
    .custom((value) => {
      return !!Object.keys(value).length;
    })
    .withMessage("Please provide required field to update")
    .custom((value) => {
      const updates = Object.keys(value);
      const allowUpdates = [
        "exam_start_time",
        "exam_end_time",
        "exam_date",
        "paper_url",
      ];
      return updates.every((update) => allowUpdates.includes(update));
    })
    .withMessage("Invalid updates!"),
];

exports.createExamAnswerSubmissionSchema = [
  body("exam_id").exists().withMessage("Exam Id is required"),
  body("student_id").exists().withMessage("Student Id is required"),
  body("answer_sheet_url")
    .exists()
    .withMessage("Document is required")
    .notEmpty()
    .withMessage("Answer Sheet file can not be empty")
];
