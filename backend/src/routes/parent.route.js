const express = require("express");
const router = express.Router();
const parentController = require("../controllers/parent.controller");
const parentAuth = require("../middleware/parentAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  validateLogin,
} = require("../middleware/validators/parentValidator.middleware");

router.get(
  "/whoami",
  parentAuth(),
  awaitHandlerFactory(parentController.getCurrentParent)
);

router.post(
  "/login",
  validateLogin,
  awaitHandlerFactory(parentController.parentLogin)
);

module.exports = router;
