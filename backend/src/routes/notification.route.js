const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const adminAuth = require("../middleware/adminAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createNotificationSchema,
} = require("../middleware/validators/notificationValidator.middleware");

router.get(
  "/",
  awaitHandlerFactory(notificationController.getAllNotifications)
);
router.get(
  "/id/:id",
  awaitHandlerFactory(notificationController.getNotificationById)
);
router.get(
  "/guardian/:id",
  awaitHandlerFactory(notificationController.getNotificationByParent)
);
router.post(
  "/",
  adminAuth(),
  createNotificationSchema,
  awaitHandlerFactory(notificationController.createNotification)
);

module.exports = router;
