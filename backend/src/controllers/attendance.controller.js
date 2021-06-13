const AttendanceModel = require("../models/attendance.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Course Controller
 ******************************************************************************/
class AttendanceController {
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

  createTeacherAttendance = async (req, res, next) => {
    this.checkValidation(req);
    const result = await AttendanceModel.createTeacher(req.body);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Attendance was created!");
  };

  checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(400, "Validation failed", errors);
    }
  };

  //Teacher

  getStudentAttendanceByTeacherId = async (req, res, next) => {
    let attendanceList = await AttendanceModel.getStudentAttendanceByTeacherId({
      teacher_id: req.params.teacherid,
      from_date: req.body.fromDate,
      to_date: req.body.toDate,
      course_id: req.body.courseId,
    });
    if (!attendanceList.length) {
      throw new HttpException(204, "Attendance not found");
    } else {
      attendanceList = attendanceList.map((attendance) => {
        return attendance;
      });

      res.send(attendanceList);
    }
  };

  //Parent

  getStudentAttendanceByParentId = async (req, res, next) => {
    let attendanceList = await AttendanceModel.getStudentAttendanceByParentId({
      guardian_id: req.params.parentid,
      from_date: req.body.fromDate,
      to_date: req.body.toDate,
      course_id: req.body.courseId,
    });
    if (!attendanceList.length) {
      throw new HttpException(204, "Attendance not found");
    } else {
      attendanceList = attendanceList.map((attendance) => {
        return attendance;
      });

      res.send(attendanceList);
    }
  };
}

module.exports = new AttendanceController();
