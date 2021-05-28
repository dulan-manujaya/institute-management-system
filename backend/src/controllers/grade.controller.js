const GradeModel = require("../models/grade.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Grade Controller
 ******************************************************************************/
class GradeController {
  getAllGrades = async (req, res, next) => {
    let gradeList = await GradeModel.find();
    if (!gradeList.length) {
      throw new HttpException(204, "Grades not found");
    } else {
      gradeList = gradeList.map((grade) => {
        const { password, ...gradeWithoutPassword } = grade;
        return gradeWithoutPassword;
      });

      res.send(gradeList);
    }
  };

  getGradeById = async (req, res, next) => {
    const grade = await GradeModel.findOne({
      grade_id: req.params.id,
    });
    if (!grade) {
      throw new HttpException(204, "Grade not found");
    }
    const { password, ...gradeWithoutPassword } = grade;
    res.send(gradeWithoutPassword);
  };

  createGrade = async (req, res, next) => {
    this.checkValidation(req);
    const result = await GradeModel.create(req.body);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Grade is created!");
  };

  updateGrade = async (req, res, next) => {
    this.checkValidation(req);

    await this.hashPassword(req);

    const { confirm_password, ...restOfUpdates } = req.body;

    const result = await GradeModel.update(restOfUpdates, req.params.id);

    if (!result) {
      throw new HttpException(404, "Something went wrong");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows
      ? "Grade not found"
      : affectedRows && changedRows
      ? "Grade updated successfully"
      : "Updated failed";

    res.send({ message, info });
  };

  deleteGrade = async (req, res, next) => {
    const result = await GradeModel.delete(req.params.id);
    if (!result) {
      throw new HttpException(204, "Grade not found");
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
/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new GradeController();
