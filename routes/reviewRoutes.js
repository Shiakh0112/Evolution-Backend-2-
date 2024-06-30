const express = require("express");
const {
  createReview,
  updateReview,
  deleteReview,
  getReviews,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createReview).get(getReviews);

router.route("/:id").put(protect, updateReview).delete(protect, deleteReview);

module.exports = router;
