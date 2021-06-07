const EnrollmentModel = require("../models/enrollment.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Enrollment Controller
 ******************************************************************************/
class EnrollmentController {
  getAllEnrollments = async (req, res, next) => {
    let enrollmentList = await EnrollmentModel.find();
    if (!enrollmentList.length) {
      throw new HttpException(204, "Enrollments not found");
    } else {
      enrollmentList = enrollmentList.map((enrollment) => {
        const { password, ...enrollmentWithoutPassword } = enrollment;
        return enrollmentWithoutPassword;
      });

      res.send(enrollmentList);
    }
  };

  getEnrollmentById = async (req, res, next) => {
    const enrollment = await EnrollmentModel.findOne({
      enrollment_id: req.params.id,
    });
    if (!enrollment) {
      throw new HttpException(204, "Enrollment not found");
    }
    const { password, ...enrollmentWithoutPassword } = enrollment;
    res.send(enrollmentWithoutPassword);
  };

  getMyEnrollmentsTeacher = async (req, res, next) => {
    let enrollmentList = await EnrollmentModel.findMy({
      teacher_id: req.params.teacherid,
    });
    if (!enrollmentList.length) {
      throw new HttpException(204, "Enrollment not found");
    } else {
      enrollmentList = enrollmentList.map((enrollment) => {
        const { password, ...enrollmentWithoutPassword } = enrollment;
        return enrollmentWithoutPassword;
      });

      res.send(enrollmentList);
    }
  };

  getStudentEnrollments = async (req, res, next) => {
    let enrollmentList = await EnrollmentModel.findStudents({
      student_id: req.params.studentid,
      is_accepted: true,
    });
    if (!enrollmentList.length) {
      throw new HttpException(204, "Enrollment not found");
    } else {
      enrollmentList = enrollmentList.map((enrollment) => {
        const { password, ...enrollmentWithoutPassword } = enrollment;
        return enrollmentWithoutPassword;
      });

      res.send(enrollmentList);
    }
  };

  getMyEnrollmentsStudent = async (req, res, next) => {
    let enrollmentList = await EnrollmentModel.findMy({
      student_id: req.params.studentid
    });
    if (!enrollmentList.length) {
      throw new HttpException(204, "Enrollments not found");
    } else {
      enrollmentList = enrollmentList.map((enrollment) => {
        const { password, ...enrollmentWithoutPassword } = enrollment;
        return enrollmentWithoutPassword;
      });

      res.send(enrollmentList);
    }
  };

  // getEnrollmentsByGrade = async (req, res, next) => {
  //   let enrollmentList = await EnrollmentModel.byGrade({
  //     teacher_id: req.params.teacherid,
  //     course_id: req.params.courseid,
  //   });
  //   if (!enrollmentList.length) {
  //     throw new HttpException(204, "Enrollment not found");
  //   } else {
  //     enrollmentList = enrollmentList.map((enrollment) => {
  //       const { password, ...enrollmentWithoutPassword } = enrollment;
  //       return enrollmentWithoutPassword;
  //     });

  //     res.send(enrollmentList);
  //   }
  // };

  getEnrollmentsGradeStudent = async (req, res, next) => {
    let enrollmentList = await EnrollmentModel.byGradeWithStudents({
      course_id: req.params.courseid,
      teacher_id: req.params.teacherid,
    });
    if (!enrollmentList.length) {
      throw new HttpException(204, "Enrollment not found");
    } else {
      enrollmentList = enrollmentList.map((enrollment) => {
        const { password, ...enrollmentWithoutPassword } = enrollment;
        return enrollmentWithoutPassword;
      });

      res.send(enrollmentList);
    }
  };

  getEnrollmentDetails = async (req, res, next) => {
    let enrollmentList = await EnrollmentModel.getEnrollmentDetails({
      teacher_id: req.params.teacherid,
    });
    if (!enrollmentList.length) {
      throw new HttpException(204, "Enrollment not found");
    } else {
      enrollmentList = enrollmentList.map((enrollment) => {
        const { password, ...enrollmentWithoutPassword } = enrollment;
        return enrollmentWithoutPassword;
      });

      res.send(enrollmentList);
    }
  };

  getMyPendingEnrollments = async (req, res, next) => {
    let enrollmentList = await EnrollmentModel.findByAvailability({
      teacher_id: req.params.teacherid,
      is_accepted: false,
    });
    if (!enrollmentList.length) {
      throw new HttpException(204, "Enrollment not found");
    } else {
      enrollmentList = enrollmentList.map((enrollment) => {
        const { password, ...enrollmentWithoutPassword } = enrollment;
        return enrollmentWithoutPassword;
      });

      res.send(enrollmentList);
    }
  };

  getMyApprovedEnrollments = async (req, res, next) => {
    let enrollmentList = await EnrollmentModel.findByAvailability({
      teacher_id: req.params.teacherid,
      is_accepted: true,
    });
    if (!enrollmentList.length) {
      throw new HttpException(204, "Enrollmeny not found");
    } else {
      enrollmentList = enrollmentList.map((enrollment) => {
        const { password, ...enrollmentWithoutPassword } = enrollment;
        return enrollmentWithoutPassword;
      });

      res.send(enrollmentList);
    }
  };

  createEnrollment = async (req, res, next) => {
    this.checkValidation(req);

    const result = await EnrollmentModel.create(req.body);

    const response = {
      newId: result.insertId,
      message: "Enrollment is created successfully!",
    };

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send(response);
  };

  updateEnrollment = async (req, res, next) => {
    this.checkValidation(req);

    const { ...restOfUpdates } = req.body;

    const result = await EnrollmentModel.update(restOfUpdates, req.params.id);

    if (!result) {
      throw new HttpException(404, "Something went wrong");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows
      ? "Enrollment not found"
      : affectedRows && changedRows
      ? "Enrollment updated successfully"
      : "Updated failed";

    res.send({ message, info });
  };

  deleteEnrollment = async (req, res, next) => {
    const result = await EnrollmentModel.delete(req.params.id);
    if (!result) {
      throw new HttpException(204, "Enrollment not found");
    }
    res.send("Enrollment has been deleted");
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
module.exports = new EnrollmentController();
