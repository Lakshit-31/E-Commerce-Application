const express = require("express");
const authRouter = express.Router();
const AuthController = require("./authController");
const validattionMiddleware = require("../../middlewares/authenticatemiddleware");

// Register Api
authRouter.post("/register", AuthController.registerController);

// Login Api
authRouter.post(
  "/login",
  AuthController.loginController /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Login karke cookie set karta hai'
    #swagger.requestBody = {
      required: true,
      content: { "application/json": { schema: { $ref: "#/components/schemas/LoginBody" } } }
    }
    #swagger.responses[200] = { description: 'Login successful' }
    #swagger.responses[401] = { description: 'Galat email ya password' }
  */,
);

// Refresh Api
authRouter.post(
  "/refresh",
  AuthController.refreshController /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Refresh token'
  */,
);

// Logout Api
authRouter.post(
  "/logout",
  validattionMiddleware,
  AuthController.logoutController,
);

// Change-Password Api
authRouter.post(
  "/changePassword",
  validattionMiddleware,
  AuthController.changePasswordController,
);

module.exports = authRouter;
