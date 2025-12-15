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
    }).populate("client", "name");

    res.json(reviews);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createReview,
  getProviderReviews
};
