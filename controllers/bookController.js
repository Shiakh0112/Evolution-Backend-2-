const Book = require("../models/Book");

const getBooks = async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;

  const query = {
    ...(status && { status }),
    ...(search && {
      $or: [
        { title: new RegExp(search, "i") },
        { author: new RegExp(search, "i") },
      ],
    }),
  };

  try {
    const books = await Book.find(query)
      .populate("user", "username")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
};

const createBook = async (req, res) => {
  const { title, author, status } = req.body;

  try {
    const book = await Book.create({
      title,
      author,
      status,
      user: req.user._id,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: "Error creating book" });
  }
};

const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, status } = req.body;

  try {
    const book = await Book.findById(id);

    if (book && book.user.toString() === req.user._id.toString()) {
      book.title = title || book.title;
      book.author = author || book.author;
      book.status = status || book.status;

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: "Book not found or unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error updating book" });
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);

    if (book && book.user.toString() === req.user._id.toString()) {
      await book.remove();
      res.json({ message: "Book removed" });
    } else {
      res.status(404).json({ message: "Book not found or unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error deleting book" });
  }
};

const getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorites" });
  }
};

const addToFavorites = async (req, res) => {
  const { bookId } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user.favorites.includes(bookId)) {
      return res.status(400).json({ message: "Book already in favorites" });
    }

    user.favorites.push(bookId);
    await user.save();

    res.status(201).json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Error adding to favorites" });
  }
};

const removeFromFavorites = async (req, res) => {
  const { bookId } = req.params;

  try {
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(
      (favBookId) => favBookId.toString() !== bookId
    );
    await user.save();

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Error removing from favorites" });
  }
};

module.exports = {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
};
