const express = require("express");
const helmet = require("helmet");
const app = express();
const cookiePareser = require("cookieParser");
const cors = require("cors");
const mongoSenitization = require("mongoSenitization");
app.use(express.json());
app.use(helmet());
app.use(cors({ origin, credential: true }));
app.use(cookiePareser());
app.use(mongoSenitization());

cookieParser();

mongoSanitize();
compression();
morgan("dev");
rateLimit();

// ---	routes	--
// notFound
// errorHandler

app.get("/api/v1/health", (_req, res) =>
  res.status(200).json(
    apiResponse(
      200,
      {
        service: "ecom-backend",
        env: process.env.NODE_ENV,
        uptimeSeconds: Math.round(process.uptime()),
        timestamp: new Date().toIsoString(),
      },
      "API is running",
    ),
  ),
);
module.exports = app;
