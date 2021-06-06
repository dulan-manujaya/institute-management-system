const HttpException = require("../utils/HttpException.utils");
const AdminModel = require("../models/admin.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const auth = () => {
  return async function (req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const bearer = "Bearer ";

      if (!authHeader || !authHeader.startsWith(bearer)) {
        throw new HttpException(401, "Access denied. No credentials sent!");
      }

      const token = authHeader.replace(bearer, "");
      const secretKey = process.env.SECRET_JWT || "";

      // Verify Token
      const decoded = jwt.verify(token, secretKey);
      const admin = await AdminModel.findOne({ admin_id: decoded.admin_id });

      if (!admin) {
        throw new HttpException(401, "Authentication failed!");
      }

      // check if the current admin is the owner admin
      const ownerAuthorized = req.params.id == admin.admin_id;

      // if the current admin is not the owner and
      // if the admin role don't have the permission to do this action.
      // the admin will get this error
      // if (!ownerAuthorized && roles.length && !roles.includes(admin.role)) {
      //   throw new HttpException(401, "Unauthorized");
      // }

      // if the admin has permissions
      req.currentAdmin = admin;
      next();
    } catch (e) {
      e.status = 401;
      next(e);
    }
  };
};

module.exports = auth;
