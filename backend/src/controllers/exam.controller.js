const ExamModel = require("../models/exam.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Exam Controller
 ******************************************************************************/
class ExamController {
  getAllExams = async (req, res, next) => {
    let examList = await ExamModel.find();
    if (!examList.length) {
      throw new HttpException(204, "Exams not found");
    } else {
      examList = examList.map((exam) => {
        const { password, ...examWithoutPassword } = exam;
        return examWithoutPassword;
      });

      res.send(examList);
    }
  };

  getExamById = async (req, res, next) => {
    const exam = await ExamModel.findOne({
      exam_id: req.params.id,
    });
    if (!exam) {
      throw new HttpException(204, "Exam not found");
    }
    const { password, ...examWithoutPassword } = exam;
    res.send(examWithoutPassword);
  };

  getMyExams = async (req, res, next) => {
    let examList = await ExamModel.findUploadedExams({
      teacher_id: req.params.teacherid,
    });
    if (!examList.length) {
      throw new HttpException(204, "Exam not found");
    } else {
      examList = examList.map((exam) => {
        const { password, ...examWithoutPassword } = exam;
        return examWithoutPassword;
      });

      res.send(examList);
    }
  };

  getMyExamsByCourse = async (req, res, next) => {
    let examList = await ExamModel.findSubmittedByCourse({
      teacher_id: req.params.teacherid,
      course_id: req.params.courseid,
    });
    if (!examList.length) {
      throw new HttpException(204, "Exam not found");
    } else {
      examList = examList.map((exam) => {
        const { password, ...examWithoutPassword } = exam;
        return examWithoutPassword;
      });

      res.send(examList);
    }
  };

  creatExam = async (req, res, next) => {
    this.checkValidation(req);
    const result = await ExamModel.create(req.body);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Exam was created!");
  };

  updateExam = async (req, res, next) => {
    this.checkValidation(req);

    const { ...restOfUpdates } = req.body;

    const result = await ExamModel.update(restOfUpdates, req.params.id);

    if (!result) {
      throw new HttpException(404, "Something went wrong");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows
      ? "Exam not found"
      : affectedRows && changedRows
      ? "Exam updated successfully"
      : "Updated failed";

    res.send({ message, info });
  };

  deleteExam = async (req, res, next) => {
    const result = await ExamModel.delete(req.params.id);
    if (!result) {
      throw new HttpException(204, "Exam not found");
    }
    res.send("Exam has been deleted");
  };

  checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(400, "Validation failed", errors);
    }
  };

  // Student

  getByStudentId = async (req, res, next) => {
    let examList = await ExamModel.getExamsByStudentId({
      student_id: req.params.studentId,
    });
    if (!examList.length) {
      throw new HttpException(204, "Exams not found");
    } else {
      examList = examList.map((exam) => {
        return exam;
      });

      res.send(examList);
    }
  };

  getExamAnswerSubmissonsByStudentId = async (req, res, next) => {
    let examAnswerSubmissonsList =
      await ExamModel.getExamAnswerSubmissonsByStudentId({
        student_id: req.params.studentId,
      });
    if (!examAnswerSubmissonsList.length) {
      throw new HttpException(204, "Exams not found");
    } else {
      examAnswerSubmissonsList = examAnswerSubmissonsList.map((exam) => {
        return exam;
      });

      res.send(examAnswerSubmissonsList);
    }
  };

  createExamAnswerSubmission = async (req, res, next) => {
    this.checkValidation(req);
    const result = await ExamModel.createExamAnswerSubmission(req.body);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Exam Answer Submission was created!");
  };
}

module.exports = new ExamController();
