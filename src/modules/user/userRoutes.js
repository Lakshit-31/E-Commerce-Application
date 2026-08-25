const express = require("express");
const userController = require("./userController");
const validattionMiddleware = require("../../middlewares/authenticatemiddleware");
const UserRouter = express.Router();

UserRouter.use(validattionMiddleware);

UserRouter.get("/me", userController.getOwnProfileController);

module.exports = UserRouter;
