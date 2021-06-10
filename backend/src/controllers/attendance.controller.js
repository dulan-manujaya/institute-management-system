const AttendanceModel = require("../models/attendance.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Course Controller
 ******************************************************************************/
class CoursesController {
  getAllAttendance = async (req, res, next) => {
    let attendanceList = await AttendanceModel.find();
    if (!attendanceList.length) {
      throw new HttpException(204, "Attendance not found");
    } else {
      attendanceList = attendanceList.map((attendance) => {
        const { password, ...attendanceWithoutPassword } = attendance;
        return attendanceWithoutPassword;
      });

      res.send(attendanceList);
    }
  };

  getAttendanceById = async (req, res, next) => {
    const attendance = await AttendanceModel.findOne({
      attendance_id: req.params.id,
    });
    if (!attendance) {
      res.status(204).send("Course not found!");
    }
    const { password, ...attendanceWithoutPassword } = attendance;
    res.send(attendanceWithoutPassword);
  };

  getAttendanceByCourse = async (req, res, next) => {
    let attendanceList = await AttendanceModel.find({
      course_id: req.params.id,
    });
    if (!attendanceList.length) {
      throw new HttpException(204, "Course not found");
    } else {
      attendanceList = attendanceList.map((attendance) => {
        const { password, ...attendanceWithoutPassword } = attendance;
        return attendanceWithoutPassword;
      });

      res.send(attendanceList);
    }
  };

  getAttendanceByStudent = async (req, res, next) => {
    let attendanceList = await AttendanceModel.find({
      student_id: req.params.id,
    });
    if (!attendanceList.length) {
      throw new HttpException(204, "Course not found");
    } else {
      attendanceList = attendanceList.map((attendance) => {
        const { password, ...attendanceWithoutPassword } = attendance;
        return attendanceWithoutPassword;
      });

      res.send(attendanceList);
    }
  };

  getAttendanceByDate = async (req, res, next) => {
    let attendanceList = await AttendanceModel.find({
      att_date: req.params.date,
    });
    if (!attendanceList.length) {
      throw new HttpException(204, "Course not found");
    } else {
      attendanceList = attendanceList.map((attendance) => {
        const { password, ...attendanceWithoutPassword } = attendance;
        return attendanceWithoutPassword;
      });

      res.send(attendanceList);
    }
  };

  createAttendance = async (req, res, next) => {
    this.checkValidation(req);
    const result = await AttendanceModel.create(req.body);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Attendance was created!");
  };

  updateCourse = async (req, res, next) => {
    this.checkValidation(req);

    const { confirm_password, ...restOfUpdates } = req.body;

    const result = await AttendanceModel.update(restOfUpdates, req.params.id);

    if (!result) {
      throw new HttpException(404, "Something went wrong");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows
      ? "Course not found"
      : affectedRows && changedRows
      ? "Course updated successfully"
      : "Updated failed";

    res.send({ message, info });
  };

  deleteCourse = async (req, res, next) => {
    const result = await AttendanceModel.delete(req.params.id);
    if (!result) {
      throw new HttpException(204, "Course not found");
    }
    res.send("Course has been deleted");
  };

  checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(400, "Validation failed", errors);
    }
  };
}

module.exports = new CoursesController();
