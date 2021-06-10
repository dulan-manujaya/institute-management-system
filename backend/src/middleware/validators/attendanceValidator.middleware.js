const { body } = require("express-validator");

exports.createAttendanceSchema = [
  body("student_id").exists().withMessage("Student is required"),
  body("course_id").exists().withMessage("Course is required"),
  body("att_date").exists().withMessage("Date is required"),
];

// exports.updateAttendanceSchema = [
//   body("amount").optional(),
//   body("course_name").optional(),
//   body()
//     .custom((value) => {
//       return !!Object.keys(value).length;
//     })
//     .withMessage("Please provide required field to update")
//     .custom((value) => {
//       const updates = Object.keys(value);
//       const allowUpdates = ["amount", "course_name"];
//       return updates.every((update) => allowUpdates.includes(update));
//     })
//     .withMessage("Invalid updates!"),
// ];
