const express = require("express");

const authRouter = express.Router();

const AuthController = require("../controller/authController");

// Register API
authRouter.post("/register", AuthController.registerController);

// Login API
authRouter.post("/login", AuthController.loginController);

// Refresh Token API
authRouter.post("/refresh", AuthController.refreshController);

// Logout API
authRouter.post("/logout", AuthController.logoutController);

// Change Password API
authRouter.post("/change-password", AuthController.changePasswordController);

module.exports = authRouter;
