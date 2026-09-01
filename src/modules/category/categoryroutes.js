const express = require("express");
const CategoryController = require("./categorycontroller");
const { upload } = require("../../middlewares/uploadmiddleware");
const loadResource = require("../../middlewares/loadResourcemiddleware");
const CategoryModel = require("../../models/categoryModel");
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
categoryRouter.patch(
  "/:id",
  loadResource(CategoryModel),
  upload.single("image"),
  CategoryController.updateCategoryController,
);

// delete category
categoryRouter.delete(
  "/:id",
  loadResource(CategoryModel),
  CategoryController.deleteCategoryController,
);

module.exports = categoryRouter;
