const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validation");

const { profileSchema } = require("../validations/profile_valid");
const {
  createProfile,
  getMyProfile,
  updateProfile,
  deleteProfile
} = require("../controllers/profileController");

// créer un profil (1 fois max)
router.post("/", auth, validate(profileSchema), createProfile);

// récupérer mon profil
router.get("/me", auth, getMyProfile);

// update profil
router.put("/", auth, validate(profileSchema), updateProfile);

// supprimer profil
router.delete("/", auth, deleteProfile);

module.exports = router;
