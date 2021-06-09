const ParentModel = require("../models/parent.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Parent Controller
 ******************************************************************************/
class ParentController {
  getParentById = async (req, res, next) => {
    const parent = await ParentModel.findOne({ guardian_id: req.params.id });
    if (!parent) {
      throw new HttpException(204, "Parent not found");
    }

    const { password, ...parentWithoutPassword } = parent;

    res.send(parentWithoutPassword);
  };

  getCurrentParent = async (req, res, next) => {
    const { password, ...parentWithoutPassword } = req.currentParent;

    res.send(parentWithoutPassword);
  };

  parentLogin = async (req, res, next) => {
    this.checkValidation(req);

    const { email: guardian_email, password: guardian_password } = req.body;

    const parent = await ParentModel.findOne({ guardian_email });

    if (!parent) {
      throw new HttpException(401, "Unable to login!");
    }

    const isMatch = await bcrypt.compare(
      guardian_password,
      parent.guardian_password
    );

    if (!isMatch) {
      throw new HttpException(401, "Incorrect password!");
    }

    // parent matched!
    const secretKey = process.env.SECRET_JWT || "";
    const token = jwt.sign(
      { guardian_id: parent.guardian_id.toString() },
      secretKey,
      {
        expiresIn: "24h",
      }
    );

    const { password, ...parentWithoutPassword } = parent;

    res.send({ ...parentWithoutPassword, token });
  };

  checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(400, "Validation failed", errors);
    }
  };

  // hash password if it exists
  hashPassword = async (req) => {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 8);
    }
  };
}

/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new ParentController();
