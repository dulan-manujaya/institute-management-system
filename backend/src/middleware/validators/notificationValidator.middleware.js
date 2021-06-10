const { body } = require("express-validator");

exports.createNotificationSchema = [
  body("guardian_id").exists().withMessage("Guardian is required"),
  body("message").exists().withMessage("Message is required"),
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
