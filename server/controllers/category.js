import Category from "../models/category.js";

export const getAllCategory = async(req, res) => {
  const id = req.user.id;

  try {
    const categories = await Category.find({userId: id})
    res.status(200).json(categories)
  } catch (error) {
    next(error)
  }
}


export const addCategory = async (req, res) => {
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

export const deleteCategory = async (req, res) => {
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

