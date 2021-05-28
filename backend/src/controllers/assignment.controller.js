const AssignmentModel = require("../models/assignment.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Assignment Controller
 ******************************************************************************/
class AssignmentController {
  getAllAssignments = async (req, res, next) => {
    let assignmentList = await AssignmentModel.find();
    if (!assignmentList.length) {
      throw new HttpException(204, "Assignments not found");
    } else {
      assignmentList = assignmentList.map((assignment) => {
        const { password, ...assignmentWithoutPassword } = assignment;
        return assignmentWithoutPassword;
      });

      res.send(assignmentList);
    }
  };

  getAssignmentById = async (req, res, next) => {
    const assignment = await AssignmentModel.findOne({
      assignment_id: req.params.id,
    });
    if (!assignment) {
      throw new HttpException(204, "Assignment not found");
    }
    const { password, ...assignmentWithoutPassword } = assignment;
    res.send(assignmentWithoutPassword);
  };

  getMyAssignments = async (req, res, next) => {
    let assignmentList = await AssignmentModel.findSubmitted({
      teacher_id: req.params.teacherid,
    });
    if (!assignmentList.length) {
      throw new HttpException(204, "Assignment not found");
    } else {
      assignmentList = assignmentList.map((assignment) => {
        const { password, ...assignmentWithoutPassword } = assignment;
        return assignmentWithoutPassword;
      });

      res.send(assignmentList);
    }
  };

  getMyAssignmentsByCourse = async (req, res, next) => {
    let assignmentList = await AssignmentModel.findSubmittedByCourse({
      teacher_id: req.params.teacherid,
      course_id: req.params.courseid,
    });
    if (!assignmentList.length) {
      throw new HttpException(204, "Assignment not found");
    } else {
      assignmentList = assignmentList.map((assignment) => {
        const { password, ...assignmentWithoutPassword } = assignment;
        return assignmentWithoutPassword;
      });

      res.send(assignmentList);
    }
  };

  createAssignment = async (req, res, next) => {
    this.checkValidation(req);
    const result = await AssignmentModel.create(req.body);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Assignment was created!");
  };

  updateAssignment = async (req, res, next) => {
    this.checkValidation(req);

    const { ...restOfUpdates } = req.body;

    const result = await AssignmentModel.update(restOfUpdates, req.params.id);

    if (!result) {
      throw new HttpException(404, "Something went wrong");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows
      ? "Assignment not found"
      : affectedRows && changedRows
      ? "Assignment updated successfully"
      : "Updated failed";

    res.send({ message, info });
  };

  deleteAssignment = async (req, res, next) => {
    const result = await AssignmentModel.delete(req.params.id);
    if (!result) {
      throw new HttpException(204, "Assignment not found");
    }
    res.send("Assignment has been deleted");
  };

  checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(400, "Validation failed", errors);
    }
  };

  // Student

  getByStudentId = async (req, res, next) => {
    let assignmentsList = await AssignmentModel.getAssignmentsByStudentId({
      student_id: req.params.studentId,
    });
    if (!assignmentsList.length) {
      throw new HttpException(204, "Assignments not found");
    } else {
      assignmentsList = assignmentsList.map((assignment) => {
        return assignment;
      });

      res.send(assignmentsList);
    }
  };
}
module.exports = new AssignmentController();
