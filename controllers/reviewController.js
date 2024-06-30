const Review = require("../models/Review");

const createReview = async (req, res) => {
  const { bookId, text, rating } = req.body;

  try {
    const review = await Review.create({
      text,
      rating,
      book: bookId,
      user: req.user._id,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: "Error creating review" });
  }
};

const updateReview = async (req, res) => {
  const { id } = req.params;
  const { text, rating } = req.body;

  try {
    const review = await Review.findById(id);

    if (review && review.user.toString() === req.user._id.toString()) {
      review.text = text || review.text;
      review.rating = rating || review.rating;

      const updatedReview = await review.save();
      res.json(updatedReview);
    } else {
      res.status(404).json({ message: "Review not found or unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error updating review" });
  }
};

const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id);

    if (review && review.user.toString() === req.user._id.toString()) {
      await review.remove();
      res.json({ message: "Review removed" });
    } else {
      res.status(404).json({ message: "Review not found or unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error deleting review" });
  }
};

const getReviews = async (req, res) => {
  const { bookId } = req.query;

  try {
    const reviews = await Review.find({ book: bookId })
      .populate("user", "username")
      .exec();

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReviews,
};
