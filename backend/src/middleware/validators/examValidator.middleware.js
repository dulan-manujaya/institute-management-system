const { body } = require("express-validator");

exports.createExamchema = [
  body("course_id").exists().withMessage("Course is required"),
  body("exam_name")
    .exists()
    .withMessage("Exam Title is required")
    .notEmpty()
    .withMessage("Exam Title can not be empty"),
];

exports.createExamAnswerSubmissionSchema = [
  body("exam_id").exists().withMessage("Exam Id is required"),
  body("student_id").exists().withMessage("Student Id is required"),
  body("answer_sheet_url")
    .exists()
    .withMessage("Document is required")
    .notEmpty()
    .withMessage("Answer Sheet file can not be empty"),
];
