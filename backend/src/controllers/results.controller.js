const ResultModel = require("../models/result.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Result Controller
 ******************************************************************************/
class ResultController {
  getAllReults = async (req, res, next) => {
    let resultList = await ResultModel.findAll();
    if (!resultList.length) {
      throw new HttpException(204, "Results not found");
    } else {
      resultList = resultList.map((result) => {
        const { password, ...resultsWithoutPassword } = result;
        return resultsWithoutPassword;
      });

      res.send(resultList);
    }
  };

  getCourseById = async (req, res, next) => {
    const result = await ResultModel.findOne({
      course_id: req.params.id,
    });
    if (!result) {
      res.status(204).send("Result not found!");
    }
    const { password, ...resultsWithoutPassword } = result;
    res.send(resultsWithoutPassword);
  };

  getResultsByExam = async (req, res, next) => {
    let resultList = await ResultModel.findByExam({
      exam_id: req.params.examid,
    });
    if (!resultList.length) {
      throw new HttpException(204, "Result not found");
    } else {
      resultList = resultList.map((result) => {
        const { password, ...resultsWithoutPassword } = result;
        return resultsWithoutPassword;
      });

      res.send(resultList);
    }
  };

  getMyCourses = async (req, res, next) => {
    let resultList = await ResultModel.find({
      teacher_id: req.params.teacherid,
    });
    if (!resultList.length) {
      throw new HttpException(204, "Results not found");
    } else {
      resultList = resultList.map((result) => {
        const { password, ...resultsWithoutPassword } = result;
        return resultsWithoutPassword;
      });

      res.send(resultList);
    }
  };

  getMyCoursesByGrade = async (req, res, next) => {
    let resultList = await ResultModel.findMyByGrade({
      teacher_id: req.params.teacherid,
      grade_id: req.params.gradeid,
    });

    if (!resultList.length) {
      throw new HttpException(204, "Results not found");
    } else {
      resultList = resultList.map((result) => {
        const { password, ...resultsWithoutPassword } = result;
        return resultsWithoutPassword;
      });

      res.send(resultList);
    }
  };

  createResults = async (req, res, next) => {
    this.checkValidation(req);
    const result = await ResultModel.create(req.body);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Result was created!");
  };

  updateResults = async (req, res, next) => {
    this.checkValidation(req);

    const { confirm_password, ...restOfUpdates } = req.body;

    const result = await ResultModel.update(restOfUpdates, req.params.id);

    if (!result) {
      throw new HttpException(404, "Something went wrong");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows
      ? "Result not found"
      : affectedRows && changedRows
      ? "Result updated successfully"
      : "Updated failed";

    res.send({ message, info });
  };

  // deleteCourse = async (req, res, next) => {
  //   const result = await ResultModel.delete(req.params.id);
  //   if (!result) {
  //     throw new HttpException(204, "Result not found");
  //   }
  //   res.send("Result has been deleted");
  // };

  checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(400, "Validation failed", errors);
    }
  };

  // Student

  getByStudentId = async (req, res, next) => {
    let resultsList = await ResultModel.getResultsByStudentId({
      student_id: req.params.studentid,
      course_id: req.body.courseId,
    });
    if (!resultsList.length) {
      throw new HttpException(204, "Results not found");
    } else {
      resultsList = resultsList.map((result) => {
        return result;
      });

      res.send(resultsList);
    }
  };

  //Teacher

  getByTeacherId = async (req, res, next) => {
    let resultsList = await ResultModel.getResultsByTeacherId({
      teacher_id: req.params.teacherid,
      course_id: req.body.courseId,
      student_id: req.body.studentId,
    });
    if (!resultsList.length) {
      throw new HttpException(204, "Results not found");
    } else {
      resultsList = resultsList.map((result) => {
        return result;
      });

      res.send(resultsList);
    }
  };

  //Parent

  getByParentId = async (req, res, next) => {
    let resultsList = await ResultModel.getResultsByParentId({
      guardian_id: req.params.parentid,
      course_id: req.body.courseId,
      student_id: req.body.studentId,
    });
    if (!resultsList.length) {
      throw new HttpException(204, "Results not found");
    } else {
      resultsList = resultsList.map((result) => {
        return result;
      });

      res.send(resultsList);
    }
  };
}

module.exports = new ResultController();
