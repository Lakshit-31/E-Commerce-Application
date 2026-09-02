const express = require("express");
const validattionMiddleware = require("../../middlewares/authenticatemiddleware");
const cartController = require("./cartController");
const CartRouter = express.Router();

CartRouter.use(validattionMiddleware);

CartRouter.get("/", cartController.get);
CartRouter.post("/", cartController.add);
CartRouter.patch("/:productId", cartController.updateQty);
CartRouter.delete("/:productId", cartController.remove);
CartRouter.delete("/", cartController.clear);

module.exports = CartRouter;
