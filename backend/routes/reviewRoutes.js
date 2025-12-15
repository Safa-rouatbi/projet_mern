const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validation");
const { reviewSchema } = require("../validations/review_valid");

const {
  createReview,
  getProviderReviews
} = require("../controllers/reviewController");

// client → créer review
router.post("/", auth, validate(reviewSchema), createReview);

// public → voir reviews d’un provider
router.get("/provider/:providerId", getProviderReviews);

module.exports = router;
