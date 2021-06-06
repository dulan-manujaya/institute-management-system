const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const auth = require("../middleware/adminAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createAdminSchema,
  updateAdminSchema,
  validateLogin,
} = require("../middleware/validators/adminValidator.middleware");

router.get("/", auth(), awaitHandlerFactory(adminController.getAllAdmins));
router.get(
  "/id/:id",
  auth(),
  awaitHandlerFactory(adminController.getAdminById)
);
router.get(
  "/email/:email",
  auth(),
  awaitHandlerFactory(adminController.getAdminByEmail)
);
router.get(
  "/whoami",
  auth(),
  awaitHandlerFactory(adminController.getCurrentAdmin)
);
router.post(
  "/",
  createAdminSchema,
  awaitHandlerFactory(adminController.createAdmin)
);
router.patch(
  "/id/:id",
  auth(),
  updateAdminSchema,
  awaitHandlerFactory(adminController.updateAdmin)
);
router.delete(
  "/id/:id",
  auth(),
  awaitHandlerFactory(adminController.deleteAdmin)
);

router.post(
  "/login",
  validateLogin,
  awaitHandlerFactory(adminController.adminLogin)
);

module.exports = router;
