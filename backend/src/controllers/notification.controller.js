const NotificationModel = require("../models/notification.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Notification Controller
 ******************************************************************************/
class CoursesController {
  getAllNotifications = async (req, res, next) => {
    let notificationList = await NotificationModel.find();
    if (!notificationList.length) {
      throw new HttpException(204, "Attendance not found");
    } else {
      notificationList = notificationList.map((notification) => {
        const { password, ...notificationWithoutPassword } = notification;
        return notificationWithoutPassword;
      });

      res.send(notificationList);
    }
  };

  getNotificationById = async (req, res, next) => {
    const notification = await NotificationModel.findOne({
      attendance_id: req.params.id,
    });
    if (!notification) {
      res.status(204).send("Notification not found!");
    }
    const { password, ...notificationWithoutPassword } = notification;
    res.send(notificationWithoutPassword);
  };

  getNotificationByParent = async (req, res, next) => {
    let notificationList = await NotificationModel.find({
      guardian_id: req.params.id,
    });
    if (!notificationList.length) {
      throw new HttpException(204, "Notification not found");
    } else {
      notificationList = notificationList.map((notification) => {
        const { password, ...notificationWithoutPassword } = notification;
        return notificationWithoutPassword;
      });

      res.send(notificationList);
    }
  };

  createNotification = async (req, res, next) => {
    this.checkValidation(req);
    const result = await NotificationModel.create(req.body);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Notification was created!");
  };

  checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(400, "Validation failed", errors);
    }
  };
}

module.exports = new CoursesController();
