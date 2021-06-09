const HttpException = require("../utils/HttpException.utils");
const ParentModel = require("../models/parent.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const parentAuth = () => {
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
      const parent = await ParentModel.findOne({ guardian_id: decoded.guardian_id });

      if (!parent) {
        throw new HttpException(401, "Authentication failed!");
      }

      // check if the current parent is the owner parent
      const ownerAuthorized = req.params.id == parent.guardian_id;

      // if the current parent is not the owner and
      // if the parent role don't have the permission to do this action.
      // the parent will get this error
      // if (!ownerAuthorized && roles.length && !roles.includes(parent.role)) {
      //   throw new HttpException(401, "Unauthorized");
      // }

      // if the parent has permissions
      req.currentParent = parent;
      next();
    } catch (e) {
      e.status = 401;
      next(e);
    }
  };
};

module.exports = parentAuth;
