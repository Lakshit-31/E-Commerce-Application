const apiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const { OK, CREATED } = require("../../utils/httpStatus");
const ProductService = require("./productService");

const searchProducts = asyncHandler(async (req, res) => {
  const result = await ProductService.search();

  res
    .status(OK)
    .json(apiResponse(OK, result, "fetch search products successfully"));
});

const getSingleProduct = asyncHandler(async (req, res) => {
  console.log(req.params.slug);
  const result = await ProductService.getSingle(req.params.slug);

  res
    .status(OK)
    .json(apiResponse(OK, result, "fetch single product successfully"));
});

const getAllSellerProducts = asyncHandler(async (req, res) => {
  const result = await ProductService.getAllSeller(req.user._id, req.query);

  res
    .status(OK)
    .json(apiResponse(OK, result, "fetch all seller products successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const result = await ProductService.update(req.resource, req.body, req.files);

  res.status(OK).json(apiResponse(OK, result, "update product successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const result = await ProductService.deleteSingle(req.resource);

  res.status(OK).json(apiResponse(OK, result, "delete product successfully"));
});

const updateProductStatus = asyncHandler(async (req, res) => {
  const result = await ProductService.updateStatus(req.resource, req.body);

  res.status(OK).json(apiResponse(OK, result, "update status successfully"));
});

const getAllProductsAdmin = asyncHandler(async (req, res) => {
  const result = await ProductService.getAllAdmin();

  res
    .status(OK)
    .json(apiResponse(OK, result, "fetch all Admin products successfully"));
});

// create Product
const createProduct = asyncHandler(async (req, res) => {
  const result = await ProductService.create(req.user._id, req.body, req.files);

  res
    .status(CREATED)
    .json(apiResponse(CREATED, result, "create product successfully"));
});

const getAllProductListFilter = asyncHandler(async (req, res) => {
  const result = await ProductService.getAllProductsFilter(req.query);

  res
    .status(OK)
    .json(apiResponse(OK, result, "fetch all filter products successfully"));
});

module.exports = {
  getAllProductListFilter,
  createProduct,
  getAllProductsAdmin,
  getAllProductsAdmin,
  updateProductStatus,
  searchProducts,
  getSingleProduct,
  getAllSellerProducts,
  updateProduct,
  deleteProduct,
};
