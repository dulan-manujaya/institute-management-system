const CourseModel = require("../models/course.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Course Controller
 ******************************************************************************/
class CoursesController {
  getAllCourses = async (req, res, next) => {
    let courseList = await CourseModel.find();
    if (!courseList.length) {
      throw new HttpException(204, "Courses not found");
    } else {
      courseList = courseList.map((course) => {
        const { password, ...courseWithoutPassword } = course;
        return courseWithoutPassword;
      });

      res.send(courseList);
    }
  };

  getCourseById = async (req, res, next) => {
    const course = await CourseModel.findOne({
      course_id: req.params.id,
    });
    if (!course) {
      res.status(204).send("Course not found!");
    }
    const { password, ...courseWithoutPassword } = course;
    res.send(courseWithoutPassword);
  };

  getCourseByGrade = async (req, res, next) => {
    let courseList = await CourseModel.find({ grade_id: req.params.id });
    if (!courseList.length) {
      throw new HttpException(204, "Course not found");
    } else {
      courseList = courseList.map((course) => {
        const { password, ...courseWithoutPassword } = course;
        return courseWithoutPassword;
      });

      res.send(courseList);
    }
  };

  getMyCourses = async (req, res, next) => {
    let courseList = await CourseModel.find({
      teacher_id: req.params.teacherid,
    });
    if (!courseList.length) {
      throw new HttpException(204, "Courses not found");
    } else {
      courseList = courseList.map((course) => {
        const { password, ...courseWithoutPassword } = course;
        return courseWithoutPassword;
      });

      res.send(courseList);
    }
  };

  getMyCoursesByGrade = async (req, res, next) => {
    let courseList = await CourseModel.findMyByGrade({
      teacher_id: req.params.teacherid,
      grade_id: req.params.gradeid,
    });

    if (!courseList.length) {
      throw new HttpException(204, "Courses not found");
    } else {
      courseList = courseList.map((course) => {
        const { password, ...courseWithoutPassword } = course;
        return courseWithoutPassword;
      });

      res.send(courseList);
    }
  };

  createCourse = async (req, res, next) => {
    this.checkValidation(req);
    const result = await CourseModel.create(req.body);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Course was created!");
  };

  updateCourse = async (req, res, next) => {
    this.checkValidation(req);

    await this.hashPassword(req);

    const { confirm_password, ...restOfUpdates } = req.body;

    const result = await CourseModel.update(restOfUpdates, req.params.id);

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
    const result = await CourseModel.delete(req.params.id);
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

  // Student

  getByStudentId = async (req, res, next) => {
    let coursesList = await CourseModel.getCoursesByStudentId({
      student_id: req.params.studentId,
    });
    if (!coursesList.length) {
      throw new HttpException(204, "Courses not found");
    } else {
      coursesList = coursesList.map((course) => {
        return course;
      });

      res.send(coursesList);
    }
  };
}

module.exports = new CoursesController();
