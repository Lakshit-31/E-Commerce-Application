const asyncHandler = require("../../utils/asyncHandler");
const { OK } = require("../../utils/httpStatus");
const apiResponse = require("../../utils/apiResponse");
const CartService = require("./cartService");

const get = asyncHandler(async (req, res) => {
  const result = await CartService.getCart(req.user._id);

  res.status(OK).json(apiResponse(OK, result, "Cart fetched successfully"));
});

const add = asyncHandler(async (req, res) => {
  const productId = req.body.productId;
  const qty = req.body.qty;
  console.log("productId", productId);
  console.log("qty", qty);

  if (!productId || !qty)
    throw apiError(400, "Product ID and quantity are required");

  const result = await CartService.addToCart(req.user._id, productId, qty);

  res
    .status(OK)
    .json(apiResponse(OK, result, "Product added to cart successfully"));
});

const updateQty = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const qty = req.body.qty;

  if (!productId || qty === undefined)
    throw apiError(400, "Product ID and quantity are required");

  const result = await CartService.setQty(req.user._id, productId, qty);

  res
    .status(OK)
    .json(apiResponse(OK, result, "Cart quantity updated successfully"));
});

const remove = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  const result = await CartService.removeFromCart(req.user._id, productId);

  res
    .status(OK)
    .json(apiResponse(OK, result, "Product removed from cart successfully"));
});

const clear = asyncHandler(async (req, res) => {
  const result = await CartService.clearCart(req.user._id);

  res.status(OK).json(apiResponse(OK, result, "Cart cleared successfully"));
});

module.exports = { get, add, updateQty, remove, clear };
