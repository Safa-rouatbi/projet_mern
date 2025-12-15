const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validation");

const { serviceSchema } = require("../validations/service_valid");
const {
  createService,
  getAllServices,
  getMyServices,
  updateService,
  deleteService
} = require("../controllers/serviceController");

// public
router.get("/", getAllServices);

// provider
router.post("/", auth, validate(serviceSchema), createService);
router.get("/me", auth, getMyServices);
router.put("/:id", auth, validate(serviceSchema), updateService);
router.delete("/:id", auth, deleteService);

module.exports = router;
