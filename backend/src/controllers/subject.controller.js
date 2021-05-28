const SubjectModel = require("../models/subject.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Subject Controller
 ******************************************************************************/
class SubjectController {
  getAllSubjects = async (req, res, next) => {
    let subjectList = await SubjectModel.find();
    if (!subjectList.length) {
      throw new HttpException(204, "Subjects not found");
    } else {
      subjectList = subjectList.map((subject) => {
        const { password, ...subjectWithoutPassword } = subject;
        return subjectWithoutPassword;
      });

      res.send(subjectList);
    }
  };

  getSubjectById = async (req, res, next) => {
    const subject = await SubjectModel.findOne({
      subject_id: req.params.id,
    });
    if (!subject) {
      throw new HttpException(204, "Subject not found");
    }
    const { password, ...subjectWithoutPassword } = subject;
    res.send(subjectWithoutPassword);
  };

  createSubject = async (req, res, next) => {
    this.checkValidation(req);
    const result = await SubjectModel.create(req.body);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Subject is created!");
  };

  updateSubject = async (req, res, next) => {
    this.checkValidation(req);

    await this.hashPassword(req);

    const { confirm_password, ...restOfUpdates } = req.body;

    const result = await SubjectModel.update(restOfUpdates, req.params.id);

    if (!result) {
      throw new HttpException(404, "Something went wrong");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows
      ? "Subject not found"
      : affectedRows && changedRows
      ? "Subject updated successfully"
      : "Updated failed";

    res.send({ message, info });
  };

  deleteSubject = async (req, res, next) => {
    const result = await SubjectModel.delete(req.params.id);
    if (!result) {
      throw new HttpException(204, "Subject not found");
    }
    res.send("Subject has been deleted");
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
module.exports = new SubjectController();
