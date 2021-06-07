const ForgotPasswordModel = require("../models/forgot_password.model");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Student Controller
 ******************************************************************************/
class forgotPasswordController {
  hashPassword = async (req) => {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 8);
    }
  };
  verifyEmail = async (req, res, next) => {
    if (req.body.type == "student") {
      
      const student = await ForgotPasswordModel.verifyStudentEmail({
        email: req.body.email,
      });
      if (!student) {
        res.send({
          isExist: false,
          message: "This email doesn't belong to any student!",
        });
      } else {
        await ForgotPasswordModel.insertOTP(req.body.email);
        res.send({
          isExist: true,
        });
      }
    } else if (req.body.type == "teacher") {
      const teacher = await ForgotPasswordModel.verifyTeacherEmail({
        email: req.body.email,
      });
      if (!teacher) {
        res.send({
          isExist: false,
          message: "This email doesn't belong to any teacher!",
        });
      } else {
        await ForgotPasswordModel.insertOTP(req.body.email);
        res.send({
          isExist: true,
        });
      }
    }
  };
  verifyOTP = async (req, res, next) => {
    const isValid = await ForgotPasswordModel.verifyOTP({
      email: req.body.email,
      otp: req.body.otp,
    });
    if (isValid == 0) {
      res.send({
        isExist: false,
        message: "This otp code is invalid!",
      });
    } else {
      res.send({
        isExist: true,
      });
    }
  };
  resetPassword = async (req, res, next) => {
    await this.hashPassword(req);
    const result = await ForgotPasswordModel.resetPassword(req.body);
    if (result == 1) {
      res.send({
        updated: true,
        message: "The password has been reset sucessfully",
      });
    }
    if (result == 0) {
      res.status(400).send({
        updated: false,
        message: "Error encountered while resetting password",
      });
    }
  };
}

/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new forgotPasswordController();
