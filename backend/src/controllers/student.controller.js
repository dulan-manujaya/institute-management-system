const StudentModel = require("../models/student.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Student Controller
 ******************************************************************************/
class StudentController {
  getAllStudents = async (req, res, next) => {
    let studentList = await StudentModel.find();
    if (!studentList.length) {
      throw new HttpException(204, "Students not found");
    }

    studentList = studentList.map((student) => {
      const { password, ...studentrWithoutPassword } = student;
      return studentrWithoutPassword;
    });

    res.send(studentList);
  };

  getStudentsByCourse = async (req, res, next) => {
    let studentList = await StudentModel.findStudentByCourse({
      course_id: req.params.courseid,
    });
    if (!studentList.length) {
      throw new HttpException(204, "Students not found");
    }

    studentList = studentList.map((student) => {
      const { password, ...studentrWithoutPassword } = student;
      return studentrWithoutPassword;
    });

    res.send(studentList);
  };

  getAllPendingStudents = async (req, res, next) => {
    let studentList = await StudentModel.findPending();
    if (!studentList.length) {
      await res.status(204).send("No pending students found");
    } else {
      studentList = studentList.map((student) => {
        const { password, ...studentrWithoutPassword } = student;
        return studentrWithoutPassword;
      });

      res.send(studentList);
    }
  };

  getAllStudentsWithGrade = async (req, res, next) => {
    let studentList = await StudentModel.findWithGrade();
    if (!studentList.length) {
      await res.status(204).send("No pending students found");
    } else {
      studentList = studentList.map((student) => {
        const { password, ...studentrWithoutPassword } = student;
        return studentrWithoutPassword;
      });

      res.send(studentList);
    }
  };

  getLastStudent = async (req, res, next) => {
    const student = await StudentModel.findLast();
    if (!student) {
      throw new HttpException(204, "Student not found");
    }

    const { password, ...studentWithoutPassword } = student;

    res.send(studentWithoutPassword);
  };

  getStudentById = async (req, res, next) => {
    const student = await StudentModel.findOne({ student_id: req.params.id });
    if (!student) {
      throw new HttpException(204, "Student not found");
    }

    const { password, ...studentWithoutPassword } = student;

    res.send(studentWithoutPassword);
  };

  getStudentByAuthId = async (req, res, next) => {
    const student = await StudentModel.findOne({
      student_auth_id: req.params.authid,
    });
    if (!student) {
      throw new HttpException(204, "Student not found");
    }

    const { password, ...studentWithoutPassword } = student;

    res.send(studentWithoutPassword);
  };

  getStudentByEmail = async (req, res, next) => {
    const student = await StudentModel.findOne({ email: req.params.email });
    if (!student) {
      throw new HttpException(204, "Student not found");
    }

    const { password, ...studentWithoutPassword } = student;
    res.send(studentWithoutPassword);
  };

  getCurrentStudent = async (req, res, next) => {
    const { password, ...studentWithoutPassword } = req.currentStudent;

    res.send(studentWithoutPassword);
  };

  createStudent = async (req, res, next) => {
    this.checkValidation(req);

    var guardian_password = await this.generatePassword();
    req.body.guardian_password = guardian_password;

    await this.hashPassword(req);

    const result = await StudentModel.create(req.body);
    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Student was created!");
  };

  updateStudent = async (req, res, next) => {
    this.checkValidation(req);

    await this.hashPassword(req);

    const { confirm_password, ...restOfUpdates } = req.body;
    const result = await StudentModel.update(restOfUpdates, req.params.id);

    if (!result) {
      throw new HttpException(401, "Something went wrong");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows
      ? "Student not found"
      : affectedRows && changedRows
      ? "Student updated successfully"
      : "Updated failed";

    res.send({ message, info });
  };

  deleteStudent = async (req, res, next) => {
    const result = await StudentModel.delete(req.params.id);
    if (!result) {
      throw new HttpException(204, "Student not found");
    }
    res.send("Student has been deleted");
  };

  studentLogin = async (req, res, next) => {
    this.checkValidation(req);

    const { email, password: pass } = req.body;

    const student = await StudentModel.findOne({ email });

    if (!student) {
      throw new HttpException(401, "Unable to login!");
    }

    const isMatch = await bcrypt.compare(pass, student.password);

    if (!isMatch) {
      throw new HttpException(401, "Incorrect password!");
    }

    // student matched!
    const secretKey = process.env.SECRET_JWT || "";
    const token = jwt.sign(
      { student_id: student.student_id.toString() },
      secretKey,
      {
        expiresIn: "24h",
      }
    );

    const { password, ...studentWithoutPassword } = student;

    res.send({ ...studentWithoutPassword, token });
  };

  checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(400, "Validation failed", errors);
    }
  };

  hashPassword = async (req) => {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 8);
      req.body.guardian_password = await bcrypt.hash(
        req.body.guardian_password,
        8
      );
    }
  };

  generatePassword = async () => {
    var charArr = [];
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
      charArr.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    }
    var password = charArr.join("");
    return password;
  };

  verifyStudentEmail = async (req, res, next) => {
    const student = await StudentModel.findOne({ email: req.params.email });
    if (!student) {
      res.send({
        isExist: false,
        message: "This email doesn't belong to any student!",
      });
    } else {
      res.send({
        isExist: true,
      });
    }
  };
}

/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new StudentController();
