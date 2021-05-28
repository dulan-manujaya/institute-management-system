const SubmissionModel = require("../models/submission.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Submissions Controller
 ******************************************************************************/
class SubmissionController {
  getAllSubmissions = async (req, res, next) => {
    let submissionList = await SubmissionModel.findTeacherAll({
      teacher_id: req.params.teacherid,
    });
    if (!submissionList.length) {
      throw new HttpException(204, "Submissions not found");
    } else {
      submissionList = submissionList.map((submission) => {
        const { password, ...submissionWithoutPassword } = submission;
        return submissionWithoutPassword;
      });

      res.send(submissionList);
    }
  };

  getAllSubmissionsByAssignment = async (req, res, next) => {
    let submissionList = await SubmissionModel.findTeacherAllByAssignment({
      teacher_id: req.params.teacherid,
      assignment_id: req.params.assignmentid,
    });
    if (!submissionList.length) {
      throw new HttpException(204, "Submissions not found");
    } else {
      submissionList = submissionList.map((submission) => {
        const { password, ...submissionWithoutPassword } = submission;
        return submissionWithoutPassword;
      });

      res.send(submissionList);
    }
  };

  getSubmissionById = async (req, res, next) => {
    const submission = await SubmissionModel.findOne({
      submission_id: req.params.id,
    });
    if (!submission) {
      throw new HttpException(204, "Submission not found");
    }
    const { password, ...submissionWithoutPassword } = submission;
    res.send(submissionWithoutPassword);
  };

  getMySubmissions = async (req, res, next) => {
    let submissionList = await SubmissionModel.getSubmissionsByStudentId({
      student_id: req.params.studentid,
    });
    if (submissionList == undefined) {
      throw new HttpException(204, "Submissions not found");
    } else if (submissionList.length == undefined) {
      res.send(submissionList);
    } else {
      submissionList = submissionList.map((submission) => {
        const { password, ...submissionWithoutPassword } = submission;
        return submissionWithoutPassword;
      });

      res.send(submissionList);
    }
  };

  createSubmission = async (req, res, next) => {
    this.checkValidation(req);
    const result = await SubmissionModel.create(req.body);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Submission was created!");
  };

  updateSubmission = async (req, res, next) => {
    this.checkValidation(req);

    const { ...restOfUpdates } = req.body;

    const result = await SubmissionModel.update(restOfUpdates, req.params.id);

    if (!result) {
      throw new HttpException(404, "Something went wrong");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows
      ? "Submission not found"
      : affectedRows && changedRows
      ? "Submission updated successfully"
      : "Updated failed";

    res.send({ message, info });
  };

  deleteSubmision = async (req, res, next) => {
    const result = await SubmissionModel.delete(req.params.id);
    if (!result) {
      throw new HttpException(204, "Submission not found");
    }
    res.send("Submission has been deleted");
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
module.exports = new SubmissionController();
