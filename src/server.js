const app = require("./app");
require("dotenv").config();
const connectDB = require("./config/db");
const PORT = process.env.PORT;
const start = (async = () => {
  try {
  } catch (err) {
    console.error("database connection failed", err.message);
  }
  const server = app.listen(PORT, () => {
    console.log(`server listen on ${PORT}`);
  });
});
