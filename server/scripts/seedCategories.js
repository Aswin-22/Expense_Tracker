import dotenv from "dotenv";
dotenv.config();

import connectDb from "../config/db.js";
import Category from "../models/category.js";

const defaultCategories = [
  // EXPENSE categories
  { name: "Food & Dining", type: "EXPENSE", icon: "", color: "#FF6B6B" },
  { name: "Transport",     type: "EXPENSE", icon: "", color: "#FFA94D" },
  { name: "Shopping",      type: "EXPENSE", icon: "", color: "#845EF7" },
  { name: "Bills",         type: "EXPENSE", icon: "", color: "#339AF0" },
  { name: "Health",        type: "EXPENSE", icon: "", color: "#51CF66" },
  { name: "Education",     type: "EXPENSE", icon: "", color: "#F06595" },
  { name: "Other",         type: "EXPENSE", icon: "", color: "#868E96" },

  // INCOME categories
  { name: "Salary",        type: "INCOME",  icon: "", color: "#20C997" },
  { name: "Freelance",     type: "INCOME",  icon: "", color: "#94D82D" },
  { name: "Investment",    type: "INCOME",  icon: "", color: "#FFD43B" },
  { name: "Other",         type: "INCOME",  icon: "", color: "#868E96" },
];

async function seedCategories() {
  try {
    await connectDb();
    console.log("Connected to MongoDB");

    const existing = await Category.countDocuments();

    if (existing > 0) {
      console.log(`Skipping seed — ${existing} categories already exist.`);
      process.exit(0);
    }

    await Category.insertMany(defaultCategories);
    console.log(`Seeded ${defaultCategories.length} default categories.`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

seedCategories();