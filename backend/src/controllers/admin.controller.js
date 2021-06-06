const AdminModel = require("../models/admin.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Admin Controller
 ******************************************************************************/
class AdminController {
  getAllAdmins = async (req, res, next) => {
    let adminList = await AdminModel.find();
    if (!adminList.length) {
      throw new HttpException(204, "Admins not found");
    }

    adminList = adminList.map((admin) => {
      const { password, ...adminWithoutPassword } = admin;
      return adminWithoutPassword;
    });

    res.send(adminList);
  };

  getAdminById = async (req, res, next) => {
    const admin = await AdminModel.findOne({ admin_id: req.params.id });
    if (!admin) {
      throw new HttpException(204, "Admin not found");
    }

    const { password, ...adminWithoutPassword } = admin;

    res.send(adminWithoutPassword);
  };

  getAdminByEmail = async (req, res, next) => {
    const admin = await AdminModel.findOne({ email: req.params.email });
    if (!admin) {
      throw new HttpException(204, "Admin not found");
    }

    const { password, ...adminWithoutPassword } = admin;

    res.send(adminWithoutPassword);
  };

  getCurrentAdmin = async (req, res, next) => {
    const { password, ...adminWithoutPassword } = req.currentAdmin;

    res.send(adminWithoutPassword);
  };

  createAdmin = async (req, res, next) => {
    this.checkValidation(req);

    await this.hashPassword(req);

    const result = await AdminModel.create(req.body);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Admin was created!");
  };

  updateAdmin = async (req, res, next) => {
    this.checkValidation(req);

    await this.hashPassword(req);

    const { confirm_password, ...restOfUpdates } = req.body;
    const result = await AdminModel.update(restOfUpdates, req.params.id);

    if (!result) {
      throw new HttpException(404, "Something went wrong");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows
      ? "Admin not found"
      : affectedRows && changedRows
      ? "Admin updated successfully"
      : "Updated failed";

    res.send({ message, info });
  };

  deleteAdmin = async (req, res, next) => {
    const result = await AdminModel.delete(req.params.id);
    if (!result) {
      throw new HttpException(204, "Admin not found");
    }
    res.send("Admin has been deleted");
  };

  adminLogin = async (req, res, next) => {
    this.checkValidation(req);

    const { email, password: pass } = req.body;

    const admin = await AdminModel.findOne({ email });

    if (!admin) {
      throw new HttpException(401, "Unable to login!");
    }

    const isMatch = await bcrypt.compare(pass, admin.password);

    if (!isMatch) {
      throw new HttpException(401, "Incorrect password!");
    }

    // admin matched!
    const secretKey = process.env.SECRET_JWT || "";
    const token = jwt.sign(
      { admin_id: admin.admin_id.toString() },
      secretKey,
      {
        expiresIn: "24h",
      }
    );

    const { password, ...adminWithoutPassword } = admin;

    res.send({ ...adminWithoutPassword, token });
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
module.exports = new AdminController();
