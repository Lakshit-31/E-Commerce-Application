const CartModel = require("../../models/cartModel");
const ProductModel = require("../../models/productModel");
const MAX_QTY = 5;
const buildCart = async (userId) => {
  const cart = await CartModel.findOne({ user: userId }).populate(
    "items.product",
  );
  if (!cart) return { items: [], totalItems: 0, totalAmount: 0 };
  //	Drop	anything	the	seller	has	removed	or	deactivated	since	it	was	added
  const items = cart.items.filter(
    (item) => item.product && item.product.isActive,
  );
  return {
    items,
    totalItems: items.reduce((sum, i) => sum + i.qty, 0),
    totalAmount: items.reduce((sum, i) => sum + i.product.price * i.qty, 0),
  };
};

// get the cart for a user
const getCart = async (userId) => {
  const cart = await buildCart(userId);
  return cart;
};

// add a product to the cart for a user
const addToCart = async (userId, productId, qty = 1) => {
  const product = await ProductModel.findById(productId);

  if (!product || !product.isActive) throw apiError(404, "Product	not	found");
  if (product.stock < 1) throw apiError(400, "This	product	is	out of	stock");
  //	Find	the	cart or	create	an	empty	one,	in	ONE	query
  const cart = await CartModel.findOneAndUpdate(
    { user: userId },
    { $setOnInsert: { user: userId, items: [] } },
    { new: true, upsert: true },
  );

  const line = cart.items.find((i) => String(i.product) === String(productId));

  if (line) line.qty += Number(qty);
  else cart.items.push({ product: productId, qty: Number(qty) });
  //	THE	SERVER	caps	the	quantity.	The	dropdown	caps	it	too,	but	THIS	is	the	rule.
  const updated = cart.items.find(
    (i) => String(i.product) === String(productId),
  );

  updated.qty = Math.min(updated.qty, product.stockQty, MAX_QTY);
  await cart.save();
  return buildCart(userId);
};

const setQty = async (userId, productId, qty) => {
  const cart = await CartModel.findOne({ user: userId });
  if (!cart) throw apiError(404, "Your	cart	is	empty");
  if (qty < 1) {
    //	qty	0	means	"remove"	—	which	is	what	the	stepper	sends	on	the	last	one
    cart.items = cart.items.filter(
      (i) => String(i.product) !== String(productId),
    );
  } else {
    const line = cart.items.find(
      (i) => String(i.product) === String(productId),
    );
    if (!line) throw apiError(404, "That	item	is	not	in	your	cart");
    const product = await ProductModel.findById(productId);
    if (qty > product.stockQty)
      throw apiError(400, `Only	${product.stockQty}	left`);
    line.qty = Math.min(qty, MAX_QTY);
  }
  await cart.save();
  return buildCart(userId);
};

const removeFromCart = async (userId, productId) => {
  const cart = await CartModel.findOne({ user: userId });
  if (cart) {
    cart.items = cart.items.filter(
      (i) => String(i.product) !== String(productId),
    );
    await cart.save();
  }
  return buildCart(userId);
};
const clearCart = async (userId) => {
  await CartModel.findOneAndUpdate({ user: userId }, { items: [] });
  return buildCart(userId);
};
module.exports = { getCart, addToCart, setQty, removeFromCart, clearCart };
