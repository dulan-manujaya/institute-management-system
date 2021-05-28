const CourseMaterialModel = require("../models/courseMaterial.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Course Material Controller
 ******************************************************************************/
class CourseMaterialsController {
  getAllCourseMaterials = async (req, res, next) => {
    let courseMaterialList = await CourseMaterialModel.find();
    if (!courseMaterialList.length) {
      throw new HttpException(204, "Course materials not found");
    } else {
      courseMaterialList = courseMaterialList.map((courseMaterial) => {
        const { password, ...courseMaterialWithoutPassword } = courseMaterial;
        return courseMaterialWithoutPassword;
      });

      res.send(courseMaterialList);
    }
  };

  getCMById = async (req, res, next) => {
    const courseMaterial = await CourseMaterialModel.findOne({
      assignment_id: req.params.id,
    });
    if (!courseMaterial) {
      throw new HttpException(204, "Course Material not found");
    }
    const { password, ...courseMaterialWithoutPassword } = courseMaterial;
    res.send(courseMaterialWithoutPassword);
  };

  getMyCourseMaterials = async (req, res, next) => {
    let courseMaterialList = await CourseMaterialModel.findSubmitted({
      teacher_id: req.params.teacherid,
    });
    if (!courseMaterialList.length) {
      throw new HttpException(204, "Course Materials not found");
    } else {
      courseMaterialList = courseMaterialList.map((courseMaterial) => {
        const { password, ...courseMaterialWithoutPassword } = courseMaterial;
        return courseMaterialWithoutPassword;
      });

      res.send(courseMaterialList);
    }
  };

  createCourseMaterial = async (req, res, next) => {
    this.checkValidation(req);
    const result = await CourseMaterialModel.create(req.body);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Course Material was created!");
  };

  updateCourseMaterial = async (req, res, next) => {
    this.checkValidation(req);

    const { ...restOfUpdates } = req.body;

    const result = await CourseMaterialModel.update(
      restOfUpdates,
      req.params.id
    );

    if (!result) {
      throw new HttpException(404, "Something went wrong");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows
      ? "Course Material not found"
      : affectedRows && changedRows
      ? "Course Material updated successfully"
      : "Updated failed";

    res.send({ message, info });
  };

  deleteCourseMaterial = async (req, res, next) => {
    const result = await CourseMaterialModel.delete(req.params.id);
    if (!result) {
      throw new HttpException(204, "Course Material not found");
    }
    res.send("Course Material has been deleted");
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
module.exports = new CourseMaterialsController();
