const Review = require("../models/Review");

// CREATE REVIEW
async function createReview(req, res) {
  try {
    // seul un client peut noter
    if (req.user.role !== "client") {
      return res.status(403).json({
        error: "Seul un client peut laisser un avis"
      });
    }

    const { provider, rating, comment } = req.body;

    const review = await Review.create({
      client: req.user.id,
      provider,
      rating,
      comment
    });

    res.status(201).json(review);

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        error: "Vous avez déjà laissé un avis pour ce provider"
      });
    }

    res.status(500).json({ error: err.message });
  }
}

// GET PROVIDER REVIEWS
async function getProviderReviews(req, res) {
  try {
    const reviews = await Review.find({
      provider: req.params.providerId
    }).populate("client", "name _id");

    res.json(reviews);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// UPDATE REVIEW
async function updateReview(req, res) {
  try {
    // seul un client peut modifier un avis
    if (req.user.role !== "client") {
      return res.status(403).json({
        error: "Seul un client peut modifier un avis"
      });
    }

    const { rating, comment } = req.body;
    const reviewId = req.params.reviewId;

    // Vérifier que l'avis existe et appartient au client connecté
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        error: "Avis non trouvé"
      });
    }

    if (review.client.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Vous ne pouvez modifier que vos propres avis"
      });
    }

    // Mettre à jour l'avis
    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.json(review);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE REVIEW
async function deleteReview(req, res) {
  try {
    // seul un client peut supprimer un avis
    if (req.user.role !== "client") {
      return res.status(403).json({
        error: "Seul un client peut supprimer un avis"
      });
    }

    const reviewId = req.params.reviewId;

    // Vérifier que l'avis existe et appartient au client connecté
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        error: "Avis non trouvé"
      });
    }

    if (review.client.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Vous ne pouvez supprimer que vos propres avis"
      });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({ message: "Avis supprimé" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createReview,
  getProviderReviews,
  updateReview,
  deleteReview
};
