const express = require("express");
const CategoryController = require("./categorycontroller");
const { upload } = require("../../middlewares/uploadmiddleware");
const categoryRouter = express.Router();

// get all categories tree
categoryRouter.get("/tree", CategoryController.getCateoriesTreeController);

// get all categories
categoryRouter.get("/", CategoryController.getAllCategoriesController);

// create Category
categoryRouter.post(
  "/",
  upload.single("image"),
  CategoryController.createCategoryController,
);

// update Category
categoryRouter.patch("/:id", CategoryController.updateCategoryController);

// delete category
categoryRouter.delete("/:id", CategoryController.deleteCategoryController);

module.exports = categoryRouter;
