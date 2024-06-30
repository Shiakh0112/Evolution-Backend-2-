const express = require("express");
const {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
} = require("../controllers/bookController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getBooks).post(protect, createBook);

router.route("/:id").put(protect, updateBook).delete(protect, deleteBook);

router
  .route("/favorites")
  .get(protect, getUserFavorites)
  .post(protect, addToFavorites);

router.route("/favorites/:bookId").delete(protect, removeFromFavorites);

module.exports = router;
