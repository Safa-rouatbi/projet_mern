const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validation");
const { reviewSchema, updateReviewSchema } = require("../validations/review_valid");

const {
  createReview,
  getProviderReviews,
  updateReview,
  deleteReview
} = require("../controllers/reviewController");

// client → créer review
router.post("/", auth, validate(reviewSchema), createReview);

// public → voir reviews d'un provider
router.get("/provider/:providerId", getProviderReviews);

// client → modifier son propre avis
router.put("/:reviewId", auth, validate(updateReviewSchema), updateReview);

// client → supprimer son propre avis
router.delete("/:reviewId", auth, deleteReview);

module.exports = router;
