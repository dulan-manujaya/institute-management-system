const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const adminAuth = require("../middleware/adminAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createAdminSchema,
  updateAdminSchema,
  validateLogin,
} = require("../middleware/validators/adminValidator.middleware");

router.get("/", adminAuth(), awaitHandlerFactory(adminController.getAllAdmins));
router.get(
  "/id/:id",
  adminAuth(),
  awaitHandlerFactory(adminController.getAdminById)
);
router.get(
  "/email/:email",
  adminAuth(),
  awaitHandlerFactory(adminController.getAdminByEmail)
);
router.get(
  "/whoami",
  adminAuth(),
  awaitHandlerFactory(adminController.getCurrentAdmin)
);
router.post(
  "/",
  createAdminSchema,
  awaitHandlerFactory(adminController.createAdmin)
);
router.patch(
  "/id/:id",
  adminAuth(),
  updateAdminSchema,
  awaitHandlerFactory(adminController.updateAdmin)
);
router.delete(
  "/id/:id",
  adminAuth(),
  awaitHandlerFactory(adminController.deleteAdmin)
);

router.post(
  "/login",
  validateLogin,
  awaitHandlerFactory(adminController.adminLogin)
);

module.exports = router;
