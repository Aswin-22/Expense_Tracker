import Category from "../models/category.js";

// GET ALL CATEGORIES (OPTIONALLY FILTERED BY TYPE)
export async function getAllCategories(req, res, next) {
  const { type } = req.query;

  try {
    const filter = {};
    if (type) {
      filter.type = type.toUpperCase();
    }

    const categories = await Category.find(filter).sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
}