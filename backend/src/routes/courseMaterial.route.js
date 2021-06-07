const express = require("express");
const router = express.Router();
const courseMaterialController = require("../controllers/courseMaterial.controller");
const auth = require("../middleware/adminAuth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createCMSchema,
  updateCMSchema,
} = require("../middleware/validators/courseMaterialValidator.middleware");

router.get(
  "/",
  auth(),
  awaitHandlerFactory(courseMaterialController.getAllCourseMaterials)
);
router.get(
  "/id/:id",
  auth(),
  awaitHandlerFactory(courseMaterialController.getCMById)
);
router.get(
  "/mycoursematerials/:teacherid",
  auth(),
  awaitHandlerFactory(courseMaterialController.getMyCourseMaterials)
);
router.post(
  "/",
  auth(),
  createCMSchema,
  awaitHandlerFactory(courseMaterialController.createCourseMaterial)
);
router.patch(
  "/id/:id",
  auth(),
  updateCMSchema,
  awaitHandlerFactory(courseMaterialController.updateCourseMaterial)
);
router.delete(
  "/id/:id",
  auth(),
  awaitHandlerFactory(courseMaterialController.deleteCourseMaterial)
);

module.exports = router;
