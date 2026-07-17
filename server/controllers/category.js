import Category from "../models/category.js";
import Transaction from "../models/transaction.js";

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

// CREATE CATEGORY
export async function createCategory(req, res, next) {
  const { name, type, icon, color } = req.body;

  try {
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      type: type?.toUpperCase(),
    });

    if (existing) {
      const err = new Error("A category with this name and type already exists");
      err.statusCode = 400;
      throw err;
    }

    const category = await Category.create({
      name,
      type: type?.toUpperCase(),
      icon: icon || "",
      color: color || "#888888",
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
}

// UPDATE CATEGORY (rename / change color or icon)
export async function updateCategory(req, res, next) {
  const { id } = req.params;
  const { name, icon, color } = req.body;

  try {
    const category = await Category.findById(id);

    if (!category) {
      const err = new Error("Category not found");
      err.statusCode = 404;
      throw err;
    }

    if (name) category.name = name;
    if (icon !== undefined) category.icon = icon;
    if (color) category.color = color;

    const updated = await category.save();
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

// DELETE CATEGORY
export async function deleteCategory(req, res, next) {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      const err = new Error("Category not found");
      err.statusCode = 404;
      throw err;
    }

    // Block delete if any transactions reference this category
    const txCount = await Transaction.countDocuments({ category: id });

    if (txCount > 0) {
      const err = new Error(
        `Cannot delete — ${txCount} transaction${txCount !== 1 ? "s" : ""} use this category`
      );
      err.statusCode = 400;
      throw err;
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      message: "Category deleted successfully",
      _id: id,
    });
  } catch (error) {
    next(error);
  }
}