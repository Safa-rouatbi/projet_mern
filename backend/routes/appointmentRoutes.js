const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validation");
const { appointmentSchema } = require("../validations/appointment_valid");

const {
  createAppointment,
  getMyAppointments,
  getProviderAppointments,
  cancelAppointment
} = require("../controllers/appointmentController");


// client crée un rv
router.post("/", auth, validate(appointmentSchema), createAppointment);

// client récupère ses rdv
router.get("/", auth, getMyAppointments);

// provider récupère ses rdv
router.get("/provider", auth, getProviderAppointments);

// client annule un rdv
router.put("/cancel/:id", auth, cancelAppointment);

module.exports = router;
