const express = require("express");
const BrandRouter = express.Router();
const BrandController = require("./brandController");
const { upload } = require("../../middlewares/uploadmiddleware");
const loadResource = require("../../middlewares/loadResourcemiddleware");
const BrandModel = require("../../models/brandModel");

// get all brands (Public)
BrandRouter.get("/", BrandController.getBrandsController);

// Private
BrandRouter.post(
  "/",
  upload.single("logo"),
  BrandController.createBrandController,
);

BrandRouter.patch(
  "/:id",
  loadResource(BrandModel),
  upload.single("logo"),
  BrandController.updateBrandController,
);

BrandRouter.delete(
  "/:id",
  loadResource(BrandModel),
  BrandController.deleteBrandController,
);

module.exports = BrandRouter;
