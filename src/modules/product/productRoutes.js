const express = require("express");
const ProductRouter = express.Router();
const ProductController = require("./productController");
const { uploadMedia, upload } = require("../../middlewares/uploadmiddleware");
const validattionMiddleware = require("../../middlewares/authenticatemiddleware");
const loadResource = require("../../middlewares/loadResourcemiddleware");
const ProductModel = require("../../models/productModel");

// public no need of authentication
// get all product list (filter)PLP
ProductRouter.get("/", ProductController.getAllProductListFilter);

// search products
ProductRouter.get("/search", ProductController.searchProducts);

// get single product (slug)
ProductRouter.get("/:slug", ProductController.getSingleProduct);

// private apis authentication required
ProductRouter.use(validattionMiddleware);

// get all products seller
ProductRouter.get("/seller/mine", ProductController.getAllSellerProducts);

// update product
ProductRouter.patch(
  "/:id",
  uploadMedia.array("images", 3),
  loadResource(ProductModel),
  ProductController.updateProduct,
);

// delete product
ProductRouter.delete(
  "/:id",
  loadResource(ProductModel),
  ProductController.deleteProduct,
);

// update product by status
ProductRouter.patch(
  "/:id",
  loadResource(ProductModel),
  ProductController.updateProductStatus,
);

// get all products admin
ProductRouter.post("/admin/all", ProductController.getAllProductsAdmin);

// create product
ProductRouter.post(
  "/",
  uploadMedia.array("images", 3),
  ProductController.createProduct,
);

module.exports = ProductRouter;
