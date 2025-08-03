const Category = require("../models/category");

const addCategory = async (req, res) => {
  const { name, color, transactionId } = req.body;
  try {
    const category = await Category.create({
      name,
      color,
      transactionId,
    });
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = Category.findByIdAndDelete({ categoryId });
    if (!category) {
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({ success: true, _id: categoryId });
  } catch (error) {
    next(error);
  }
};

module.exports = { addCategory, deleteCategory };
