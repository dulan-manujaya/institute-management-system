const { body } = require("express-validator");

exports.createResult = [
  body("exam_id").exists().withMessage("Exam is required"),
  body("student_id").exists().withMessage("Student is required"),
  body("marks")
    .exists()
    .withMessage("Marks are required")
    .isNumeric()
    .withMessage("Marks should be a number"),
];

// exports.createExamAnswerSubmissionSchema = [
//   body("exam_id").exists().withMessage("Exam Id is required"),
//   body("student_id").exists().withMessage("Student Id is required"),
//   body("answer_sheet_url")
//     .exists()
//     .withMessage("Document is required")
//     .notEmpty()
//     .withMessage("Answer Sheet file can not be empty"),
// ];
