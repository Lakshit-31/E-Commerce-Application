const express = require("express");

const userController = require("./userController");
const validattionMiddleware = require("../../middlewares/authenticatemiddleware");

const { upload } = require("../../middlewares/uploadmiddleware");
const verifyImageType = require("../../middlewares/verifyImage");

const UserRouter = express.Router();

UserRouter.use(validattionMiddleware);

UserRouter.get("/me", userController.getOwnProfileController);

UserRouter.patch(
  "/me",
  upload.single("profilePhoto"),
  verifyImageType,
  userController.updateOwnProfileController,
);

UserRouter.get("/me/addresses", userController.getAllAddressesController);

UserRouter.post("/me/addresses", userController.createAddressController);

UserRouter.patch(
  "/me/addresses/:addrId",
  userController.updateAddressController,
);

UserRouter.delete(
  "/me/addresses/:addrId",
  userController.deleteAddressController,
);

UserRouter.patch("/:id/status", userController.updateUserStatusController);

UserRouter.delete("/:id", userController.deleteUserController);

UserRouter.get("/", userController.getAllusersController);

module.exports = UserRouter;
