const { body } = require("express-validator");

exports.createCMSchema = [
  body("course_id").exists().withMessage("Course is required"),
  body("cm_name")
    .exists()
    .withMessage("Course Material Title is required")
    .notEmpty()
    .withMessage("Title can not be empty"),
  body("cm_file_url")
    .exists()
    .withMessage("Document is required")
    .notEmpty()
    .withMessage("Document can not be empty"),
];

exports.updateCMSchema = [
  body("cm_name").optional(),
  body("cm_file_url").optional(),
  body("cm_availability").optional(),
  body("cm_file_url").optional(),
  body()
    .custom((value) => {
      return !!Object.keys(value).length;
    })
    .withMessage("Please provide required field to update")
    .custom((value) => {
      const updates = Object.keys(value);
      const allowUpdates = [
        "cm_name",
        "cm_file_url",
        "cm_availability",
        "cm_file_url",
      ];
      return updates.every((update) => allowUpdates.includes(update));
    })
    .withMessage("Invalid updates!"),
];
